import React, { useState } from "react";

import camera from "../../assets/icons/camera.png";
import mic from "../../assets/icons/mic.png";
import phone from "../../assets/icons/phone.png";

import "./style.css";

const Controls = (props) => {
  const { client, tracks, setStart, setInCall } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: false });

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);

      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);

      console.log(tracks[1].setEnabled);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    // we close the tracks to perform cleanup
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };

  return (
    <div className="controls">
      <div
        className={`control-container ${trackState.video ? "on" : "off"}`}
        id="camera-btn"
        onClick={() => mute("video")}
      >
        <img src={camera} alt="camera_icon" />
      </div>

      <div
        className={`control-container ${trackState.audio ? "on" : "off"}`}
        id="mic-btn"
        onClick={() => mute("audio")}
      >
        <img src={mic} alt="mic_icon" />
      </div>

      <div
        className="control-container leave-btn"
        onClick={() => leaveChannel()}
      >
        <img src={phone} alt="phone_icon" />
      </div>
    </div>
  );
};

export default Controls;
