import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { Box, Container, Typography } from "@mui/material";
import Loader from "@/utils/Loader";

const SuccessPage = () => {
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
            Payment was Successful!
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default SuccessPage;
