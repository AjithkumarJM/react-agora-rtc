import React from "react";
import { AgoraVideoPlayer } from "agora-rtc-react";

import "./styles.css";

const Videos = (props) => {
  const { users, tracks } = props;
  const videoConfig = {
    fit: "cover",
  };

  return (
    <div
      style={{ gridTemplateColumns: `repeat(${users.length}, "1fr")` }}
      className="videos"
    >
      {/* AgoraVideoPlayer component takes in the video track to render the stream,
              you can pass in other props that get passed to the rendered div */}

      <AgoraVideoPlayer
        className={`${users.length > 0 ? "small-frame" : ""} video-player`}
        config={videoConfig}
        videoTrack={tracks[1]}
      />

      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <AgoraVideoPlayer
                config={videoConfig}
                className="video-player"
                videoTrack={user.videoTrack}
                key={user.uid}
              />
            );
          } else return null;
        })}
    </div>
  );
};

export default Videos;
