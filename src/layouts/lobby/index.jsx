/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Button, Input } from "antd";
import { useNavigate, Link } from "react-router-dom";

import "./styles.css";

const Lobby = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();

    navigate(`/room=${roomName}`);
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
              value={roomName}
              onChange={(e) =>
                setRoomName(
                  e.target.value.trim().split(" ").join("_").toLowerCase()
                )
              }
            />

            <Button type="primary" size="large">
              <Link to={`/room=${roomName}`}> Join Room </Link>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
