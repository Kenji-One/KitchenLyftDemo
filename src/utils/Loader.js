import { useEffect } from "react";
import { Backdrop, CircularProgress, Typography, Box } from "@mui/material";

// Default values shown

const Loader = ({ open, loaderText }) => {
  useEffect(() => {
    async function getLoader() {
      const { cardio } = await import("ldrs");
      cardio.register();
    }
    getLoader();
  }, []);
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 999999 }}
      open={open}
    >
      <Box className="flex flex-col items-center justify-center gap-6">
        <l-cardio size="50" stroke="4" speed="2" color="#60B143"></l-cardio>
        {/* <CircularProgress color="inherit" />
        {loaderText && (
          <Typography
            sx={{
              fontSize: "24px",
              lineHeight: "normal",
              color: "primary.reversed",
            }}
          >
            {loaderText}
          </Typography>
        )} */}
      </Box>
    </Backdrop>
  );
};

export default Loader;
