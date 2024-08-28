import { useState } from "react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import CustomInput from "@/components/helpers/CustomInput";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });
      if (!response.ok) {
        throw new Error("Failed to reset password. Please try again.");
      }
      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        router.push("/login");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
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
        />
      </Box>
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 !important",
          justifyContent: "center",
          minHeight: "100vh",
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
          {message && (
            <Alert severity={"success"} sx={{ mb: 3 }}>
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
              label="New Password"
              type="password"
              value={newPassword}
              handleChange={(e) => setNewPassword(e.target.value)}
              placeholder="****************"
              inputBoxSX={{ mb: "24px" }}
            />
            <CustomInput
              label="Repeat New Password"
              type="password"
              value={confirmPassword}
              handleChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="****************"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default ResetPasswordPage;
