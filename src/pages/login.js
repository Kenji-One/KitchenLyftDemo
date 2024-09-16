import Image from "next/legacy/image";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Alert,
} from "@mui/material";
import CustomInput from "@/components/helpers/CustomInput";
import Loader from "@/utils/Loader";

const LoginPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // console.log("session:", session);
    if (session && session.user && session.user.id) {
      router.push("/");
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    setLoading(false);

    if (result.error) {
      // If there is an error, set it to the error state
      setError("Invalid username or password.");
    } else {
      // If successful, redirect to the homepage
      router.push("/");
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
            LOG IN TO DASHBOARD
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <CustomInput
              label="Username"
              type="text"
              value={username}
              handleChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username here.."
              inputBoxSX={{ mb: "24px" }}
            />
            <CustomInput
              label="Password"
              type="password"
              value={password}
              handleChange={(e) => setPassword(e.target.value)}
              placeholder="****************"
            />

            <Link
              href="/forgot-password"
              variant="body2"
              sx={{
                display: "block",
                textAlign: "left",
                mt: "12px",
                mb: 2,
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              Forgot password?
            </Link>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Log in
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
