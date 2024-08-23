"use client";

import React from "react";
import Head from "next/head";
// import Header from "../components/Header";
import Footer from "../components/Footer";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { useRouter } from "next/navigation";

const Layout = ({ children }) => {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";
  const isForgotPage = router.pathname === "/forgot-password";
  const isResetPage = router.pathname === "/reset-password";

  return (
    <>
      <Head>
        <title>KitchenLyft</title>
        <meta
          name="description"
          content="KitchenLyft Project Management Dashboard"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            backgroundColor:
              isLoginPage || isForgotPage || isResetPage ? "#f8fcf4" : "#fff",
            minHeight: "100vh", // Ensure the Box takes up the full viewport height
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* {!isLoginPage && !isForgotPage && !isResetPage && <Header />} */}

          <Box sx={{ flex: 1 }}>{children}</Box>
          {/* {!isLoginPage && !isForgotPage && !isResetPage && <Footer />} */}
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Layout;
