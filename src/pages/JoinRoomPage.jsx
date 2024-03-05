import React, { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { io } from "socket.io-client";
import axios from "axios";

import Header from "../components/Header";
import StyledButton from "../components/StyledButton";

const socket = io.connect("https://guessing-game-backend.onrender.com/");

const JoinRoomPage = () => {
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const [userInput, setUserInput] = useState("");
  const [submit, setSubmit] = useState(false);

  const joinRoom = async () => {
    let message = "";

    if (!roomName.trim()) {
      message += "Please enter a room name!\n";
    }

    if (!userName.trim()) {
      message += "Please enter a user name!\n";
    }

    if (!userInput.trim()) {
      message += "Please enter some input!\n";
    }

    if (message) {
      alert(message);
      return;
    }

    const roomId = await fetchRoomId();
    if (!roomId) {
      return;
    }

    try {
      const response = await axios.post("/api/players", {
        roomId: roomId,
        name: userName,
        input: userInput,
      });
      const playerId = response.data._id;

      socket.emit("joinRoom", { roomName, playerId });
      console.log("done");
      setSubmit(true);
    } catch (error) {
      alert("Error joining room:", error);
    }
  };

  const fetchRoomId = async () => {
    try {
      const response = await axios.get(`/api/rooms/${roomName}`);
      if (response.data) {
        return response.data._id;
      }
      return null;
    } catch (error) {
      if (error.response.status === 404) {
        alert("Room not found!");
        return null;
      } else {
        alert("Error fetching room:", error);
        return null;
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100dvh"
    >
      {!submit ? (
        <Box>
          <Header title="Join a Room" />
          <Box mt={2} width="300px">
            <TextField
              placeholder="Room Name"
              variant="outlined"
              color="secondary"
              fullWidth
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              placeholder="User Name"
              variant="outlined"
              color="secondary"
              fullWidth
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              placeholder="Input"
              variant="outlined"
              color="secondary"
              fullWidth
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <StyledButton text="Join" onClick={joinRoom} />
          </Box>
        </Box>
      ) : (
        <>
          <Typography variant="h5" m={4} align="center">
            All set! Follow along on the host device!
          </Typography>
        </>
      )}
    </Box>
  );
};

export default JoinRoomPage;
