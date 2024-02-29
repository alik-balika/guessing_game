import React from "react";
import { Box, TextField } from "@mui/material";
import Header from "../components/Header";
import StyledButton from "../components/StyledButton";

const CreatePage = () => {
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
          sx={{ marginBottom: 2 }}
        />
        <StyledButton text="Create" />
      </Box>
    </Box>
  );
};

export default CreatePage;
