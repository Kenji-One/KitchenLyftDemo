// pages/404.js
import { Box, Typography } from "@mui/material";

const Custom404 = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        margin: "auto",
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h6">Page Not Found</Typography>
    </Box>
  );
};

export default Custom404;
