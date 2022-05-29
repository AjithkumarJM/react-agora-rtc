/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import AgoraRTM from "agora-rtm-sdk";

let initialProps = {
  client: undefined,
  peerConnection: undefined,
  channel: undefined,
  localStream: undefined,
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

function createPeerConnection() {
  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
  };

  return new RTCPeerConnection(servers);
}

const createLocalStream = async () => {
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: { min: 640, ideal: 1920, max: 1920 },
      height: { min: 480, ideal: 1080, max: 1080 },
    },
    audio: false,
  });

  return localStream;
};

const createClient = async () => {
  const client = await AgoraRTM.createInstance(process.env.REACT_APP_AGORA_ID);

  await client.login({
    uid: Math.floor(Math.random() * 1000000001).toString(),
    token: null,
  });

  return client;
};

const stopMediaStream = (mediaStream) => {
  mediaStream.getTracks().forEach((track) => {
    track.stop();
  });
};

function createRemoteStream(peerConnection) {
  const remoteStream = new MediaStream();

  // Pull tracks from Remote stream, add to video stream
  peerConnection.addEventListener("track", (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  });

  return remoteStream;
}

const createChannel = async (roomId, client) => {
  let channel = client.createChannel(roomId);
  await channel.join();

  return channel;
};

const useAgoraRtm = () => {
  const { roomId } = useParams();
  const localStream = useRef(null);
  const peerConnection = useRef(null);
  const client = useRef(null);
  const channel = useRef(null);
  const remoteStream = useRef(null);

  const setupPeerLocalConnection = async (MemberId) => {
    peerConnection.current = createPeerConnection();
    remoteStream.current = createRemoteStream(peerConnection.current); // peer2 src obj
    localStream.current = await createLocalStream(); // peer1 src obj

    if (!localStream.current) {
      localStream.current = await createLocalStream();
    }

    // Push tracks from Local stream to peer connection
    localStream.current.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, localStream.current);
    });

    peerConnection.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.current.addTrack(track);
      });
    };

    peerConnection.current.onicecandidate = async (event) => {
      if (event.candidate) {
        client.current.sendMessageToPeer(
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
  };

  const handleUserJoined = async (memberId) => {
    await setupPeerLocalConnection(memberId);

    if (peerConnection.current) {
      let offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      client.current.sendMessageToPeer(
        { text: JSON.stringify({ type: "offer", offer }) },
        memberId
      );
    }
  };

  const createAnswer = async (MemberId, offer) => {

    await setupPeerLocalConnection(MemberId);

    await peerConnection.current.setRemoteDescription(offer);

    let answer = await peerConnection.current.createAnswer();
    await peerConnection.setLocalDescription(answer);

    client.current.sendMessageToPeer(
      { text: JSON.stringify({ type: "answer", answer }) },
      MemberId
    );
  };

  const addAnswer = async (answer) => {

    if (!peerConnection.current.currentRemoteDescription) {
      peerConnection.current.setRemoteDescription(answer);
    }
  };

  const handleMessageFromPeer = async (message, MemberId) => {

    message = JSON.parse(message.text);

    if (message.type === "offer") {
      createAnswer(MemberId, message.offer);
    }

    if (message.type === "answer") {
      addAnswer(message.answer);
    }

    if (message.type === "candidate") {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(message.candidate);
      }
    }
  };

  const init = useCallback(async () => {
    client.current = await createClient();
    channel.current = await createChannel(
      roomId,
      client.current,
      peerConnection.current
    );
    localStream.current = await createLocalStream();

    channel.current.on("MemberJoined", handleUserJoined);
    client.current.on("MessageFromPeer", handleMessageFromPeer);

  }, []);

  const stop = useCallback(() => {
    if (localStream.current) {
      stopMediaStream(localStream.current);
    }

    if (peerConnection.current) {
      peerConnection.current.close();
    }
  }, []);

  useEffect(() => {
    init();

    return () => {
      stop();
    };
  }, []);

  return {
    peer1: { src: localStream.current },
    peer2: { src: remoteStream.current },
  };
};

export default useAgoraRtm;