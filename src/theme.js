import { LineWeight } from "@mui/icons-material";
import { colors } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      xss: 350,
      xs2: 400,
      xs3: 450,
      xs4: 500,
      sm: 600,
      sm2: 700,
      sm3: 800,
      md: 940,
      md2: 1024,
      md3: 1121,
      lg: 1200,
      lg2: 1300,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: "Lato, Roboto, Arial, sans-serif",
    h1: {
      fontFamily: "Paytone One, sans-serif",
      fontSize: "2rem",
      fontWeight: "bold",
    },
    h2: {
      fontFamily: "Paytone One, sans-serif",
      fontSize: "24px",
      fontWeight: "400",
      textTransform: "uppercase",
      color: "#323740",
    },
    h3: {
      fontFamily: "Paytone One, sans-serif",
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    h5: {
      fontFamily: "Paytone One, sans-serif",
      fontSize: "20px",
      fontWeight: "400",
      color: "#323740",
    },
    h6: {
      fontSize: "16px",
      fontWeight: "800",
      color: "#323740",
    },
    body1: {
      fontSize: "1rem",
    },
    button: {
      fontWeight: "bold",
    },
    detailsHeading: {
      fontSize: "14px",
      fontWeight: "800",
      LineWeight: "16.8px",
      color: "#32374099",
      textTransform: "uppercase",
      display: "flex",
      marginBottom: "8px",
    },
    inputHeading: {
      fontSize: "12px",
      lineHeight: "14.4px",
      color: "#323740",
      fontWeight: "800",
      textTransform: "uppercase",
      marginBottom: "6px",
    },
    detailsText: {
      fontSize: "18px",
      fontWeight: "600",
      LineWeight: "21.6px",
      color: "#323740",
    },
  },
  palette: {
    primary: {
      main: "#323740", // Custom primary color
    },
    secondary: {
      main: "#FFFFFF", // Custom secondary color
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#323740",
          borderRadius: "4px",
          textTransform: "none",
          padding: "12px 16px",
          fontSize: "18px",
          fontWeight: "600",
          boxShadow: "none !important",
          lineHeight: "19.2px",
          border: "0 !important",
          "&:hover": {
            backgroundColor: "rgba(50, 55, 64, 0.92)",
          },
        },
      },
      variants: [
        {
          props: { variant: "greenBtn" },
          style: {
            backgroundColor: "rgba(96, 177, 67, 1)",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "600",
            "&:hover": {
              backgroundColor: "rgba(96, 177, 67, 0.9)",
            },
          },
        },
        {
          props: { variant: "customSecondary" },
          style: {
            backgroundColor: "#f0f0f0",
            color: "#323740",
            "&:hover": {
              backgroundColor: "#d8d8d8",
            },
          },
        },
        {
          props: { variant: "btnGray" },
          style: {
            fontSize: "16px",
            margin: "auto",
            marginBottom: "16px",
            backgroundColor: "rgba(50, 55, 64, 0.102)",
            padding: "16px 24px",
            color: "#323740",
            "&:hover": {
              backgroundColor: "rgba(50, 55, 64, 0.2)",
            },
          },
        },
      ],
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: "4px !important",
          paddingLeft: "0 !important",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "#32374033",
          },
        },
        input: {
          background: "transparent",
          fontSize: "16.5px",
          fontWeight: "300",
          padding: "0px 12px !important",
          paddingLeft: "16px !important",
          ":disabled": {
            WebkitTextFillColor: "gray",
          },
          height: "43px",
          "&::placeholder": {
            opacity: 1,
            color: "#32374066",
          },
        },
        textareaAutosize: {
          background: "red",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "14px",
          fontWeight: "400",
          color: "#323740",
        },
        head: {
          fontWeight: "800",
          fontSize: "12px",
        },
        body: {
          fontSize: "18px",
          fontWeight: "500",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: "16px", // Custom container padding
        },
      },
    },
  },
});

export default theme;
