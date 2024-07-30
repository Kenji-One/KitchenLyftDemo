import { useState } from "react";
import Image from "next/legacy/image";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import CustomInput from "@/components/helpers/CustomInput";
import Loader from "@/utils/Loader";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send recovery email. Please try again.");
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <Image
          // className={styles["logo"]}
          src={"/logo-kitchen.png"}
          width={"139px"}
          height={"15px"}
          alt="logo"
          className="kitchen-logo"
        />
      </Box>
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "0 !important",
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
            RESET PASSWORD
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            We'll send a recovery link to the email which you are registered
            with.
          </Typography>
          {message && (
            <Alert severity="info" sx={{ mb: 3 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <CustomInput
              label="Email Address"
              type="email"
              value={email}
              handleChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email here.."
              inputBoxSX={{ mb: "12px" }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, color: "#fff" }}
            >
              Reset Password
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              sx={{
                backgroundColor: "#3237401A",
                "&:hover": { backgroundColor: "rgba(50, 55, 64, 0.25)" },
              }}
              href="/login"
            >
              Go Back
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default ForgotPasswordPage;
