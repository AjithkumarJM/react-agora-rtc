/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Button, Input } from "antd";

import "./styles.css";

const Lobby = (props) => {
  const { setInCall, setChannelName, channelName } = props;

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (channelName) {
      setInCall(true);
    }
  };

  return (
    <div className="lobby-prent">
      <div className="align-center h-100">
        <div className="input-section">
          <div>
            <span className="styled-text">Ready to dive in?</span>
            <span className="styled-text blue-primary">
              Create or Join Room
            </span>
          </div>

          <form onSubmit={handleOnSubmit} className="align-center">
            <Input
              placeholder="your room name"
              size="large"
              name="room"
              value={channelName}
              onChange={(e) =>
                setChannelName(
                  e.target.value.trim().split(" ").join("_").toLowerCase()
                )
              }
            />

            <Button type="primary" size="large" onClick={handleOnSubmit}>
              Join Room
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
