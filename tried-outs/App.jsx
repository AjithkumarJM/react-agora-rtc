import React from "react";
import { Route, Routes } from "react-router-dom";

import Lobby from "./layouts/lobby/index";
import Room from "./layouts/room/index";

import "./App.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room=:roomId" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
