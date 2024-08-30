import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Button, Container, Typography, Link } from "@mui/material";
import CustomInput from "@/components/helpers/CustomInput";
import Loader from "@/utils/Loader";

const CancellPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Loader open={loading} />

      <Box
        sx={{
          padding: "26px 0 26px 0",
          borderBottom: "1px solid #32374033",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* <Image
          // className={styles["logo"]}
          src={"/logo-kitchen.png"}
          width={"139px"}
          height={"15px"}
          alt="logo"
          className="kitchen-logo"
        /> */}
        <img
          src={"/logo 1.svg"}
          alt="Logo of the Company"
          className="kitchen-logo"
          style={{ cursor: "pointer" }}
          onClick={() => (window.location.href = "/")}
        />
      </Box>
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 !important",
          marginTop: "80px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            p: 3,
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 3 }}
          >
            Payment was Cancelled
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default CancellPage;
