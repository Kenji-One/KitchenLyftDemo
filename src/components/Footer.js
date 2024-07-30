import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        textAlign: "center",
        mt: "auto",
        backgroundColor: "primary.main",
        color: "white",
      }}
    >
      <Typography variant="body1">
        © 2024 KitchenLyft, All rights reserved
      </Typography>
    </Box>
  );
};

export default Footer;
