import React, { useState, useEffect } from "react";
import { Box, Grid, Stack, Typography, TextField } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

import Header from "../components/Header";
import StyledButton from "../components/StyledButton";
import "./roomPage.css";

const socket = io.connect("http://localhost:7000");

const samplePlayers = [
  {
    input: "shrek",
    belongsTo: "player1",
    ownedBy: "player1",
  },
  {
    input: "inception",
    belongsTo: "player2",
    ownedBy: "player2",
  },
  {
    input: "interstellar",
    belongsTo: "player3",
    ownedBy: "player3",
  },
  {
    input: "top gun",
    belongsTo: "player4",
    ownedBy: "player4",
  },
];

const RoomPage = () => {
  const { roomName } = useParams();
  const [roomExists, setRoomExists] = useState(true);
  const [players, setPlayers] = useState(samplePlayers);

  const [editingIndex, setEditingIndex] = useState(-1);
  const [editedInput, setEditedInput] = useState("");

  const handleDoubleClick = (index) => {
    setEditingIndex(index);
    setEditedInput(players[index].input);
  };

  const handleInputChange = (e) => {
    setEditedInput(e.target.value);
  };

  const handleInputBlur = () => {
    const updatedPlayers = [...players];
    updatedPlayers[editingIndex].input = editedInput;
    setPlayers(updatedPlayers);
    setEditingIndex(-1);
  };

  useEffect(() => {
    socket.on("playerJoined" + roomName, (data) => {
      setPlayers([...players, data.playerId]);
    });

    return () => {
      socket.off("playerJoined");
    };
  }, [players, roomName]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        await axios.get(`/api/rooms/${roomName}`);
        setRoomExists(true);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setRoomExists(false);
        } else {
          // alert("Error while retrieving room:", error);
        }
      }
    };

    fetchRoom();
  }, [roomName]);

  return (
    <Stack direction="column" alignItems="center">
      <Header title={roomName} />
      {roomExists ? (
        !players.length ? (
          <Box mt={2} width="300px">
            <Typography
              variant="body1"
              align="center"
              mb={4}
              className="loading"
            >
              Waiting for players
            </Typography>
            <StyledButton text="Start" />
          </Box>
        ) : (
          <Grid container p={3}>
            {players.map((player, index) => (
              <Grid key={index} item xs={6}>
                {editingIndex === index ? (
                  <TextField
                    fullWidth
                    value={editedInput}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onClick={(e) => e.target.select()}
                    autoFocus
                    sx={{
                      padding: 0,
                      "& .MuiInputBase-input": {
                        padding: "10px",
                      },
                    }}
                  />
                ) : (
                  <Typography
                    sx={{ border: "1px solid black", cursor: "pointer" }}
                    p={1}
                    onClick={() => handleDoubleClick(index)}
                  >
                    {player.input}
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        <Typography variant="body1" align="center">
          Room <span style={{ fontWeight: "bold" }}>{roomName}</span> does not
          exist.
        </Typography>
      )}
    </Stack>
  );
};

export default RoomPage;
