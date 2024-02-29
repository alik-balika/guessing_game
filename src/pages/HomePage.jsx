import React from "react";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";

import Header from "../components/Header";
import StyledButton from "../components/StyledButton";

const HomePage = () => {
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
        <Link to="/create">
          <StyledButton text="Create a Room" mb={2} />
        </Link>
        <StyledButton text="Join a Room" />
        <div style={{}}></div>
      </Box>
    </Box>
  );
};

export default HomePage;
