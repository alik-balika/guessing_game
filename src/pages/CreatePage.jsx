import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import StyledButton from "../components/StyledButton";

const CreatePage = () => {
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const navigateToRoomPage = () => {
    const trimmed = roomName.trim();
    if (!trimmed) {
      alert("Please enter a room name!");
      return;
    }
    navigate(`/room/${roomName}`);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100dvh"
    >
      <Header title="Create a Room" />
      <Box mt={2} width="300px">
        <TextField
          placeholder="Room Name"
          variant="outlined"
          fullWidth
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <StyledButton text="Create" onClick={navigateToRoomPage} />
      </Box>
    </Box>
  );
};

export default CreatePage;
