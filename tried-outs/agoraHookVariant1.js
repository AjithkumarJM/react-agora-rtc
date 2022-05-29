
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import AgoraRTM from "agora-rtm-sdk";

let initialProps = {
  client: undefined,
  peerConnection: undefined,
  channel: undefined,
  localStream: undefined,
  servers: {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
  },
  constraints: {
    video: {
      width: { min: 640, ideal: 1920, max: 1920 },
      height: { min: 480, ideal: 1080, max: 1080 },
    },
    audio: false,
  },
  peers: {
    peer1: {
      src: "",
      isSmallFrame: false,
    },
    peer2: {
      src: "",
      show: false,
    },
  },
};


const useAgoraRtm = () => {
  const { roomId } = useParams();
  const [rtmProps, setRtmProps] = useState(initialProps);

  const createPeerConnection = async (MemberId) => {
    const { servers, localStream, client } = rtmProps;

    let peerConnection = new RTCPeerConnection(servers),
      remoteStream = new MediaStream(),
      tempLocalStream;

    if (!localStream) {
      tempLocalStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
    } else {
      tempLocalStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, tempLocalStream);
      });
    }

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        client.sendMessageToPeer(
          {
            text: JSON.stringify({
              type: "candidate",
              candidate: event.candidate,
            }),
          },
          MemberId
        );
      }
    };

    setRtmProps((prevState) => {
      return {
        ...prevState,
        peerConnection,
        localStream: tempLocalStream,
        peers: {
          peer2: { src: remoteStream, show: true },
          peer1: { isSmallFrame: true, src: tempLocalStream },
        },
      };
    });
  };

  const createOffer = async (MemberId) => {
    const { peerConnection, client } = rtmProps;

    await createPeerConnection(MemberId);

    if (peerConnection) {
      let offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      client.sendMessageToPeer(
        { text: JSON.stringify({ type: "offer", offer }) },
        MemberId
      );
    }
  };

  const handleUserJoined = async (MemberId) => {
    console.log("A new user joined the channel:", MemberId);
    createOffer(MemberId);
  };

  const createAnswer = async (MemberId, offer) => {
    const { peerConnection, client } = rtmProps;

    await createPeerConnection(MemberId);

    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    client.sendMessageToPeer(
      { text: JSON.stringify({ type: "answer", answer }) },
      MemberId
    );
  };

  const addAnswer = async (answer) => {
    const { peerConnection } = rtmProps;

    if (!peerConnection.currentRemoteDescription) {
      peerConnection.setRemoteDescription(answer);
    }
  };

  const handleMessageFromPeer = async (message, MemberId) => {
    const { peerConnection } = rtmProps;

    message = JSON.parse(message.text);

    if (message.type === "offer") {
      createAnswer(MemberId, message.offer);
    }

    if (message.type === "answer") {
      addAnswer(message.answer);
    }

    if (message.type === "candidate") {
      if (peerConnection) {
        peerConnection.addIceCandidate(message.candidate);
      }
    }
  };

  const handleUserLeft = () => {
    setRtmProps((prevState) => {
      return {
        ...prevState,
        peers: {
          peer2: { ...prevState.peers.peer2, show: false },
          peer1: { ...prevState.peers.peer1, isSmallFrame: false },
        },
      };
    });
  };

  const init = async () => {
    let client = await AgoraRTM.createInstance(process.env.REACT_APP_AGORA_ID);

    await client.login({
      uid: Math.floor(Math.random() * 1000000001).toString(),
      token: null,
    });

    let channel = client.createChannel(roomId);
    await channel.join();

    let localStream = await navigator.mediaDevices.getUserMedia(
      rtmProps.constraints
    );

    channel.on("MemberJoined", handleUserJoined);
    channel.on("MemberLeft", handleUserLeft);

    client.on("MessageFromPeer", handleMessageFromPeer);

    setRtmProps((prevState) => {
      return {
        ...prevState,
        client,
        channel,
        localStream,
        peers: {
          ...prevState.peers,
          peer1: { ...prevState.peers.peer1, src: localStream },
        },
      };
    });
  };

  let toggleCamera = async () => {
    const { localStream } = rtmProps;

    let videoTrack = localStream
      .getTracks()
      .find((track) => track.kind === "video");

    console.log(videoTrack, "enabled");
    if (videoTrack.enabled) {
      videoTrack.enabled = false;
      document.getElementById("camera-btn").style.backgroundColor =
        "rgb(255, 80, 80)";
    } else {
      videoTrack.enabled = true;
      document.getElementById("camera-btn").style.backgroundColor =
        "rgb(179, 102, 249, .9)";
    }
  };

  let leaveChannel = async () => {
    const { channel, client } = rtmProps;

    await channel.leave();
    await client.logout();
  };

  let toggleMic = async () => {
    const { localStream } = rtmProps;

    if (localStream) {
      let audioTrack = localStream
        .getTracks()
        .find((track) => track.kind === "audio");

      if (audioTrack.enabled) {
        audioTrack.enabled = false;
        document.getElementById("mic-btn").style.backgroundColor =
          "rgb(255, 80, 80)";
      } else {
        audioTrack.enabled = true;
        document.getElementById("mic-btn").style.backgroundColor =
          "rgb(179, 102, 249, .9)";
      }
    }
  };

  useEffect(() => {
    init();
    window.addEventListener("beforeunload", leaveChannel);
  }, []);

  return {
    peer1: rtmProps.peers.peer1,
    peer2: rtmProps.peers.peer2,
    toggleMic,
    toggleCamera,
  };
};

export default useAgoraRtm;

