import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import { HomePage, CreateRoomPage, RoomPage, JoinRoomPage } from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <CssBaseline />
      <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/create-room" exact element={<CreateRoomPage />} />
        <Route path="/room/:roomName" exact element={<RoomPage />} />
        <Route path="/join-room" exact element={<JoinRoomPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
