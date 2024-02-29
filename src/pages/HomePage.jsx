import React from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
import StyledButton from "../components/StyledButton";

const HomePage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Header title="Guessing Game" />
      <Box mt={2}>
        <StyledButton text="Create a Room" mb={2} />
        <StyledButton text="Join a Room" />
        <div style={{}}></div>
      </Box>
    </Box>
  );
};

export default HomePage;
