import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import CustomInput from "@/components/helpers/CustomInput";

const AddUserPage = (props) => {
  const router = useRouter();
  console.log("sesiaaaaaa:", props);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        email,
        // firstName,
        // lastName,
        role,
      }),
    });
    if (response.ok) {
      router.push("/");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Add New User
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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
            inputBoxSX={{ mb: "24px" }}
          />
          <CustomInput
            label="Email"
            type="email"
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email here.."
            inputBoxSX={{ mb: "24px" }}
          />

          {/* <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          /> */}

          <FormControl fullWidth size="medium">
            <Select
              sx={{ height: "44px" }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              labelId="role-label"
              name={"category"}
              displayEmpty
              input={<OutlinedInput />}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem disabled value="">
                Select Role
              </MenuItem>
              <MenuItem value="CorporateAdmin">Corporate Admin</MenuItem>
              <MenuItem value="CorporateUser">Corporate User</MenuItem>
              <MenuItem value="FranchiseeAdmin">Franchisee Admin</MenuItem>
              <MenuItem value="FranchiseeUser">Franchisee User</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Add User
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  // console.log("Session:", session);

  if (!session || !session.user.role) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session: session },
  };
};

export default AddUserPage;
