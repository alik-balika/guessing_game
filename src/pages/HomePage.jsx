import React from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import StyledButton from "../components/StyledButton";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100dvh"
    >
      <Header title="Guessing Game" />
      <Box mt={2}>
        <StyledButton
          text="Create a Room"
          mb={2}
          onClick={() => navigate("/create-room")}
        />
        <StyledButton
          text="Join a Room"
          onClick={() => navigate("/join-room")}
        />
      </Box>
    </Box>
  );
};

export default HomePage;
