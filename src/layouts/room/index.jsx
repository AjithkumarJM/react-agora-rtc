import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import camera from "../../assets/icons/camera.png";
import mic from "../../assets/icons/mic.png";
import phone from "../../assets/icons/phone.png";

import useAgoraRTM from "../../hooks/useAgoraRTM";

import "./styles.css";

const Room = () => {
  const { webCam, remoteCam } = useAgoraRTM();
  const webCamRef = useRef(null);
  const remoteCamRef = useRef(null);

  useEffect(() => {
    if (!webCamRef.current) return;
    console.log(webCam.src, "webCam");

    if (webCam.src) {
      webCamRef.current.srcObject = webCam.src;
    }
  }, [webCam.src]);

  useEffect(() => {
    if (!remoteCamRef.current) return;

    if (remoteCam.src) {
      // console.log(remoteCam.src, "remoteCam");

      remoteCamRef.current.srcObject = remoteCam.src;
    }
  }, [remoteCam.src]);

  return (
    <>
      <div id="videos">
        <video
          className={`video-player ${webCam.isSmallFrame ? "smallFrame" : ""}`}
          autoPlay
          playsInline
          ref={webCamRef}
        ></video>
        {remoteCam.show && (
          <video
            className="video-player"
            autoPlay
            playsInline
            ref={remoteCamRef}
          ></video>
        )}

        {/* <video
          className={`video-player`}
          autoPlay
          playsInline
          ref={webCamRef}
        ></video>

        <video
          className="video-player"
          autoPlay
          playsInline
          ref={remoteCamRef}
        ></video> */}
      </div>
      {/* <div id="controls">
        <div
          className="control-container"
          id="camera-btn"
          onClick={toggleCamera}
        >
          <img src={camera} alt="camera_icon" />
        </div>

        <div className="control-container" id="mic-btn" onClick={toggleMic}>
          <img src={mic} alt="mic_icon" />
        </div>

        <Link to="/">
          <div className="control-container leave-btn">
            <img src={phone} alt="phone_icon" />
          </div>
        </Link>
      </div> */}
    </>
  );
};

export default Room;
