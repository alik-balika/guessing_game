import React from "react";
import PropTypes from "prop-types";
import { Container, Typography } from "@mui/material";

const Header = ({ title }) => {
  return (
    <Container sx={{ py: 2 }}>
      <Typography variant="h4" textAlign="center">
        {title}
      </Typography>
    </Container>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;
