/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";

import "./styles.css";

const Lobby = () => {
  const navigate = useNavigate();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    let room = e.target.room.value.trim().split(' ').join('_').toLowerCase();

    navigate(`/room=${room}`);
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
            <Input placeholder="foo" size="large" name="room" />

            <Button type="primary" size="large">
              Join Room
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
