import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

const PlayersStillIn = ({ playersStillIn }) => {
  return (
    <Box px={3}>
      <Typography variant="subtitle1" fontWeight="bold">
        Still in:
      </Typography>
      <Box display="flex" gap={1} flex={1} flexBasis="content" flexWrap="wrap">
        {playersStillIn.map((player, index) => (
          <Typography key={index} variant="subtitle1">
            {player}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

PlayersStillIn.propTypes = {
  playersStillIn: PropTypes.array.isRequired,
};

export default PlayersStillIn;
