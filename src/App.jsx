import React, { useState } from "react";

import Room from "./layouts/room";
import Lobby from "./layouts/lobby";

import "./App.css";

const App = () => {
  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState("");

  return (
    <div>
      {inCall ? (
        <Room setInCall={setInCall} channelName={channelName} />
      ) : (
        <Lobby
          channelName={channelName}
          setInCall={setInCall}
          setChannelName={setChannelName}
        />
      )}
    </div>
  );
};

export default App;
