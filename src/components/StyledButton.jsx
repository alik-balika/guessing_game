import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

const StyledButton = ({ text, mb, onClick, disabled }) => {
  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "black",
        borderRadius: 10,
        width: "100%",
        marginBottom: mb,
        height: 80,
      }}
      color="secondary"
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};

StyledButton.propTypes = {
  text: PropTypes.string.isRequired,
  mb: PropTypes.number,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default StyledButton;
