import { Typography, Box } from "@mui/material";

const DetailsCard = ({ BoxSX, headingText, children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: "280px",
        maxWidth: "384px",
        backgroundColor: "rgba(19, 19, 29, 0.031)",
        p: 3,
        borderRadius: "4px",
        ...BoxSX,
      }}
    >
      <Typography
        variant="detailsHeading"
        sx={{
          pb: "12px",
          borderBottom: 1,
          color: "#13131D",
          borderColor: "rgba(19, 19, 29, 0.102)",
          mb: "24px",
        }}
      >
        {headingText}
      </Typography>
      {children}
    </Box>
  );
};

export default DetailsCard;
