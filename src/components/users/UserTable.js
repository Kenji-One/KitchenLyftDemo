import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Alert,
} from "@mui/material";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import CustomInput from "../helpers/CustomInput";

const UserTable = ({ users, handleRemoveUser, handleAddUser, session2 }) => {
  const [open, setOpen] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenConfirmDelete = (userId) => {
    setUserToDelete(userId);
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setUserToDelete(null);
  };

  const handleChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // Basic email regex for validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    // Check if the email is in the correct format
    if (!emailPattern.test(newUser.email)) {
      setSnackbar({
        open: true,
        message: "Invalid email format!",
        severity: "error",
      });
      return;
    }

    // Check if the email already exists
    const response = await fetch("/api/check-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: newUser.email }),
    });
    const data = await response.json();

    if (data.exists) {
      // Email already exists, show error message
      setSnackbar({
        open: true,
        message: "Email already exists!",
        severity: "error",
      });
    } else {
      // Email does not exist, proceed with adding the user
      handleAddUser(newUser);
      setNewUser({
        username: "",
        email: "",
        password: "",
        role: "",
      });
      handleClose();
    }
  };

  const handleConfirmDelete = () => {
    handleRemoveUser(userToDelete);
    handleCloseConfirmDelete();
  };

  return (
    <Box sx={{ mt: "16px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h2">Corporate users</Typography>
        <Button
          type="submit"
          variant="greenBtn"
          color="primary"
          onClick={handleClickOpen}
        >
          Add user
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table
          aria-label="users table"
          sx={{
            borderTop: 1,
            borderColor: "#3237401A",
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                fontWeight: "800",
                textTransform: "uppercase",
                borderColor: "#3237401A",
              }}
            >
              <TableCell>Username</TableCell>
              <TableCell>Date created</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                hover
                sx={{ cursor: "pointer", borderColor: "#3237401A" }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "16px",
                    fontWeight: "800",
                    borderColor: "#3237401A",
                    textTransform: "capitalize",
                  }}
                >
                  <Avatar
                    alt={user.username}
                    src={user.image || "/default-user-image.jpg"}
                    sx={{
                      marginRight: "12px",
                      width: "52px",
                      height: "52px",
                      borderRadius: "4px",
                    }}
                  />
                  {user.username}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleClickOpenConfirmDelete(user._id)}
                    sx={{
                      color: "#DA3636",
                      backgroundColor: "#DA36361A",
                      borderRadius: "4px",
                    }}
                  >
                    <GroupRemoveIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle variant="h5" sx={{ fontSize: "22px", fontWeight: "500" }}>
          Add New User
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 1 }}>
            Please fill out the form below to add a new user.
          </DialogContentText>
          <CustomInput
            label="Username"
            type="text"
            value={newUser.username}
            handleChange={handleChange}
            placeholder="Enter your username here.."
            inputBoxSX={{ mb: "24px" }}
            inputName="username"
          />
          <CustomInput
            label="Email"
            type="email"
            value={newUser.email}
            handleChange={handleChange}
            placeholder="Enter your email here.."
            inputBoxSX={{ mb: "24px" }}
            inputName="email"
          />
          <CustomInput
            label="Password"
            type="password"
            value={newUser.password}
            handleChange={handleChange}
            placeholder="****************"
            inputName="password"
            inputBoxSX={{ mb: "24px" }}
          />
          <FormControl fullWidth size="medium">
            <Select
              sx={{ height: "44px" }}
              value={newUser.role}
              onChange={handleChange}
              labelId="role-label"
              name={"role"}
              displayEmpty
              input={<OutlinedInput />}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem disabled value="">
                Select Role
              </MenuItem>
              {session2.user.role === "CorporateAdmin" ? (
                [
                  <MenuItem key="CorporateAdmin" value="CorporateAdmin">
                    Corporate Admin
                  </MenuItem>,
                  <MenuItem key="CorporateUser" value="CorporateUser">
                    Corporate User
                  </MenuItem>,
                  <MenuItem key="FranchiseAdmin" value="FranchiseAdmin">
                    Franchise Admin
                  </MenuItem>,
                  <MenuItem key="FranchiseUser" value="FranchiseUser">
                    Franchise User
                  </MenuItem>,
                ]
              ) : (
                // Other roles should only see "FranchiseUser"
                <MenuItem value="FranchiseUser">Franchise User</MenuItem>
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "rgba(50, 55, 64, 0.1)",
              color: "#323740",
              "&:hover": { backgroundColor: "rgba(50, 55, 64, 0.2)" },
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="greenBtn" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDelete} onClose={handleCloseConfirmDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmDelete}
            color="primary"
            sx={{
              backgroundColor: "rgba(50, 55, 64, 0.1)",
              color: "#323740",
              "&:hover": { backgroundColor: "rgba(50, 55, 64, 0.2)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              backgroundColor: "#DA3636",
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(218, 54, 54, 0.9)" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserTable;
