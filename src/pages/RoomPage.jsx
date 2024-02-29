import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import Header from "../components/Header";
import StyledButton from "../components/StyledButton";
import "./roomPage.css";

const RoomPage = () => {
  const { roomName } = useParams();
  return (
    <Stack direction="column" alignItems="center">
      <Header title={roomName} />
      <Box mt={2} width="300px">
        <Typography variant="body1" align="center" mb={4} className="loading">
          Waiting for players
        </Typography>
        <StyledButton text="Start" />
      </Box>
    </Stack>
  );
};

export default RoomPage;
