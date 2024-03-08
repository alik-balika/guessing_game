import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Container, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

const Header = ({ title, copyIcon }) => {
  const [copied, setCopied] = useState(false);

  const copyTextToClipboard = () => {
    navigator.clipboard.writeText(
      `https://alik-balika.github.io/guessing_game_frontend/join-room?room=${title}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Container sx={{ py: 2 }}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h4">{title}</Typography>
        {copyIcon &&
          (copied ? (
            <AssignmentTurnedInIcon
              sx={{ ml: 1, fontSize: 30, cursor: "pointer" }}
            />
          ) : (
            <ContentCopyIcon
              sx={{ ml: 1, fontSize: 30, cursor: "pointer" }}
              onClick={copyTextToClipboard}
            />
          ))}
      </Box>
    </Container>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  copyIcon: PropTypes.bool,
};

export default Header;
