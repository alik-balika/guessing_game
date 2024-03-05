import React, { useState, useEffect } from "react";
import { Box, Grid, Stack, Typography, Select, MenuItem } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import ConfettiExplosion from "react-confetti-explosion";

import Header from "../components/Header";
import StyledButton from "../components/StyledButton";
import { generatePlayerColors } from "../utils/colors";
import "./roomPage.css";
import PlayersStillIn from "../components/PlayersStillIn";

const socket = io.connect("http://localhost:7000");

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

// TODO MAKE A PLAY AGAIN BUTTON OR SOMETHING
// MAKE HISTORY ARRAY RATHER THAN PLAYERS ARRAY IN CASE UNDO IS NEEDED
// PUBLISH CODE AND MAKE IT ONLINE

const RoomPage = () => {
  const { roomName } = useParams();
  const [roomExists, setRoomExists] = useState(true);
  const [players, setPlayers] = useState([]); // changed to historyOfPlayers later
  const [explosionKey, setExplosionKey] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const [editingIndex, setEditingIndex] = useState(-1);
  const [selectedPlayer, setSelectedPlayer] = useState("");

  const playersStillIn = [...new Set(players.map((player) => player.ownedBy))];
  const playerColors = generatePlayerColors(players);

  const isGameOver = () => {
    if (!gameStarted) {
      return false;
    }

    const firstOwner = players[0].ownedBy;
    return players.every((player) => player.ownedBy === firstOwner);
  };

  const handlePlayerGuessed = (index) => {
    const player = players[index];
    if (player.createdBy !== player.ownedBy || !gameStarted) return;
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
    setSelectedPlayer("");
  };

  useEffect(() => {
    const handlePlayerJoined = (data) => {
      if (gameStarted) return;

      const fetchPlayer = async () => {
        try {
          const response = await axios.get(`/api/players/${data.playerId}`);
          const player = response.data;

          const newPlayer = {
            _id: data.playerId,
            input: player.input,
            createdBy: player.name,
            ownedBy: player.name,
          };

          setPlayers([...players, newPlayer]);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log("Error fetching player with id:", data.playerId);
          } else {
            console.error("Error fetching player:", error);
          }
        }
      };

      fetchPlayer();
    };

    socket.on("playerJoined" + roomName, handlePlayerJoined);

    return () => {
      socket.off("playerJoined" + roomName, handlePlayerJoined);
    };
  }, [players, roomName, gameStarted]);

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

  const renderRoomContent = () => {
    if (!roomExists) {
      return (
        <Typography variant="body1" align="center">
          Room <span style={{ fontWeight: "bold" }}>{roomName}</span> does not
          exist.
        </Typography>
      );
    }

    if (!players.length) {
      return (
        <Box mt={2} width="300px">
          <Typography variant="body1" align="center" mb={4} className="loading">
            Waiting for players
          </Typography>
          <StyledButton
            text="Start"
            disabled={players.length < 3}
            onClick={() => setGameStarted(true)}
          />
        </Box>
      );
    }

    if (isGameOver()) {
      return (
        <Box>
          <ConfettiExplosion
            key={explosionKey}
            onComplete={() => setExplosionKey((prevKey) => prevKey + 1)}
          />
          <Typography gutterBottom variant="h6">
            Player{" "}
            <span
              style={{
                color: playerColors[players[0].ownedBy],
                fontWeight: "bold",
              }}
            >
              {players[0].ownedBy}
            </span>{" "}
            wins!
          </Typography>
          <StyledButton text="Play Again" />
        </Box>
      );
    }

    return (
      <Box>
        {gameStarted && <PlayersStillIn playersStillIn={playersStillIn} />}
        <Grid container p={3}>
          {players.map((player, index) => (
            <Grid key={player._id} item xs={6}>
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
                    minWidth: "200px",
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
                    cursor:
                      gameStarted && player.createdBy === player.ownedBy
                        ? "pointer"
                        : "",
                    minWidth: "200px",
                  }}
                  bgcolor={
                    !gameStarted
                      ? "#eee"
                      : player.createdBy !== player.ownedBy
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
        {!gameStarted && (
          <Box p={3}>
            <StyledButton
              text="Start"
              disabled={players.length < 3}
              onClick={startGame}
            />
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Stack direction="column" alignItems="center">
      <Header title={roomName} />
      {renderRoomContent()}
    </Stack>
  );
};

export default RoomPage;
