import React, { useState, useEffect } from "react";
import { Box, Grid, Stack, Typography, Select, MenuItem } from "@mui/material";
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
    belongsTo: "bob",
    ownedBy: "bob",
  },
  {
    input: "inception",
    belongsTo: "fred",
    ownedBy: "fred",
  },
  {
    input: "interstellar",
    belongsTo: "jan",
    ownedBy: "jan",
  },
  {
    input: "top gun",
    belongsTo: "kate",
    ownedBy: "kate",
  },
  {
    input: "game night",
    belongsTo: "joey",
    ownedBy: "joey",
  },
  {
    input: "knives out",
    belongsTo: "nate",
    ownedBy: "nate",
  },
];

const RoomPage = () => {
  const { roomName } = useParams();
  const [roomExists, setRoomExists] = useState(true);
  const [players, setPlayers] = useState(samplePlayers);

  const [editingIndex, setEditingIndex] = useState(-1);
  const [selectedPlayer, setSelectedPlayer] = useState("bob");

  const playersStillIn = [...new Set(players.map((player) => player.ownedBy))];

  const handlePlayerGuessed = (index) => {
    setEditingIndex(index);
    setSelectedPlayer(playersStillIn[0]);
  };

  const handleInputBlur = () => {
    const updatedPlayers = [...players];
    updatedPlayers[editingIndex].input = selectedPlayer;
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
          <Box>
            <Box px={3}>
              <Typography variant="subtitle1" fontWeight="bold">
                Still in:
              </Typography>
              <Box
                display="flex"
                gap={1}
                flex={1}
                flexBasis="content"
                flexWrap="wrap"
              >
                {playersStillIn.map((player) => (
                  <Typography key={player} variant="subtitle1">
                    {player}
                  </Typography>
                ))}
              </Box>
            </Box>
            <Grid container p={3}>
              {players.map((player, index) => (
                <Grid key={index} item xs={6}>
                  {editingIndex === index ? (
                    <Select
                      fullWidth
                      id="player-select"
                      value={selectedPlayer}
                      label="Pick a player"
                      onChange={(e) => setSelectedPlayer(e.target.value)}
                      onBlur={handleInputBlur}
                      sx={{
                        padding: 0,
                        "& .MuiSelect-select": {
                          padding: "13px",
                        },
                      }}
                    >
                      {playersStillIn.map((player) => (
                        <MenuItem key={player} value={player}>
                          {player}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Typography
                      sx={{ border: "1px solid black", cursor: "pointer" }}
                      p={1}
                      onClick={() => handlePlayerGuessed(index)}
                      variant="h6"
                    >
                      {player.input}
                    </Typography>
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
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
