import React, { useState, useEffect } from "react";
import { Box, Grid, Stack, Typography, Select, MenuItem } from "@mui/material";
import {
  teal,
  purple,
  orange,
  deepPurple,
  deepOrange,
  indigo,
  blue,
  green,
  red,
  pink,
  yellow,
  cyan,
  lime,
} from "@mui/material/colors";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

import Header from "../components/Header";
import StyledButton from "../components/StyledButton";
import "./roomPage.css";

const socket = io.connect("http://localhost:7000");
const colorPalette = [
  teal[500],
  purple[500],
  orange[500],
  deepPurple[500],
  deepOrange[500],
  indigo[500],
  blue[500],
  green[500],
  red[500],
  pink[500],
  yellow[500],
  cyan[500],
  lime[500],
];

const samplePlayers = [
  {
    input: "shrek",
    createdBy: "bob",
    ownedBy: "bob",
  },
  {
    input: "inception",
    createdBy: "fred",
    ownedBy: "fred",
  },
  {
    input: "interstellar",
    createdBy: "jan",
    ownedBy: "jan",
  },
  {
    input: "top gun",
    createdBy: "kate",
    ownedBy: "kate",
  },
  {
    input: "game night",
    createdBy: "joey",
    ownedBy: "joey",
  },
  {
    input: "knives out",
    createdBy: "nate",
    ownedBy: "nate",
  },
];

// TODO CREATE A GAME OVER SCREEN WITH CONFETTI MAYBE? (FIND A LIBRARY)
// MAKE A PLAY AGAIN BUTTON OR SOMETHING
// MAKE HISTORY ARRAY RATHER THAN PLAYERS ARRAY IN CASE UNDO IS NEEDED
// ALSO POTENTIALLY REFACTOR THIS AS ITS GETTING BIG AND MESSY

const RoomPage = () => {
  const { roomName } = useParams();
  const [roomExists, setRoomExists] = useState(true);
  const [players, setPlayers] = useState(samplePlayers);

  const [editingIndex, setEditingIndex] = useState(-1);
  const [selectedPlayer, setSelectedPlayer] = useState("");

  const playersStillIn = [...new Set(players.map((player) => player.ownedBy))];

  const generatePlayerColors = () => {
    const playerColors = {};
    players.forEach((player, index) => {
      playerColors[player.ownedBy] = colorPalette[index % colorPalette.length];
    });
    return playerColors;
  };
  const playerColors = generatePlayerColors();

  const handlePlayerGuessed = (index) => {
    const player = players[index];
    if (player.createdBy !== player.ownedBy) return;
    setEditingIndex(index);
    setSelectedPlayer(playersStillIn[0]);
  };

  const handleInputBlur = () => {
    const previousOwner = players[editingIndex].ownedBy;

    const updatedPlayers = players.map((player) => {
      if (player.ownedBy === previousOwner) {
        return { ...player, ownedBy: selectedPlayer };
      }
      return player;
    });

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
          alert("Error while retrieving room:", error);
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
                      sx={{
                        border: "1px solid black",
                        cursor: "pointer",
                      }}
                      bgcolor={
                        player.createdBy !== player.ownedBy
                          ? playerColors[player.ownedBy]
                          : ""
                      }
                      color={
                        player.createdBy !== player.ownedBy ? "white" : "black"
                      }
                      p={1}
                      onClick={() => handlePlayerGuessed(index)}
                      variant="h6"
                    >
                      {player.createdBy === player.ownedBy
                        ? player.input
                        : player.ownedBy}
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
