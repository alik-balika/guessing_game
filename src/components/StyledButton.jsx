import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

const StyledButton = ({ text, mt, mb }) => {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "black",
        borderRadius: 10,
        width: "100%",
        marginTop: mt,
        marginBottom: mb,
        height: 80,
      }}
      color="secondary"
    >
      {text}
    </Button>
  );
};

StyledButton.propTypes = {
  text: PropTypes.string.isRequired,
  mt: PropTypes.number,
  mb: PropTypes.number,
};

export default StyledButton;
