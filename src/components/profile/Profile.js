"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Avatar, Grid, Alert } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomInput from "@/components/helpers/CustomInput";
import Loader from "@/utils/Loader";
import { useSession } from "next-auth/react";
import DetailsCard from "./DetailsCard";
import useReloadSession from "@/hooks/useReloadSession";

const Profile = () => {
  const { data: session, update } = useSession();
  const { reloadSession } = useReloadSession();
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "ml_default");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    const imageUrl = data.secure_url;

    const response = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageUrl }),
    });

    if (response.ok) {
      setSuccessMessage("Profile image updated successfully!");
      await update({ ...session, user: { ...session.user, image: imageUrl } });
      reloadSession();
    } else {
      setErrorMessage("Failed to update profile image");
    }

    setLoading(false);
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 8000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...profileData }),
    });

    if (response.ok) {
      setSuccessMessage("Profile updated successfully!");
      await update({
        ...session,
        user: { ...session.user, ...profileData },
      });
    } else {
      setErrorMessage("Failed to update profile");
    }

    setLoading(false);
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 8000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    });

    if (response.ok) {
      setSuccessMessage("Password changed successfully!");
    } else {
      setErrorMessage("Failed to change password");
    }

    setLoading(false);
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  return (
    <>
      <Loader open={loading} />
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          {session?.user?.name}
        </Typography>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 4 }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {errorMessage}
          </Alert>
        )}
        <Grid container spacing={0} gap={3}>
          <DetailsCard headingText="Profile Settings">
            <Box
              component="form"
              onSubmit={handleProfileSubmit}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "& .MuiBox-root.css-4ffsol": { margin: "0" },
              }}
            >
              <CustomInput
                type="text"
                inputName="name"
                value={profileData.name}
                handleChange={handleProfileChange}
                placeholder="Enter your name"
                inputBoxSX={{ mb: "16px" }}
              />
              <CustomInput
                type="email"
                inputName="email"
                value={profileData.email}
                handleChange={handleProfileChange}
                placeholder="Enter your email"
                inputBoxSX={{ mb: "16px" }}
              />
              {/* <Box sx={{ width: "100%", textAlign: "center" }}> */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  mt: "auto",
                  mx: "auto",
                  backgroundColor: "rgba(50, 55, 64, 0.102)",
                  color: "#323740",
                  "&:hover": {
                    backgroundColor: "rgba(50, 55, 64, 0.2)",
                  },
                }}
              >
                Save changes
              </Button>
            </Box>
            {/* </Box> */}
          </DetailsCard>
          <DetailsCard headingText="Profile Image">
            <Avatar
              alt={session?.user?.name}
              src={session?.user?.image || "/static/images/avatar/1.jpg"}
              sx={{
                width: 81,
                height: 81,
                mb: 3,
                textAlign: "center",
                mx: "auto",
              }}
            />
            <Box>
              <Button
                variant="contained"
                component="label"
                color="primary"
                fullWidth
                sx={{
                  mt: "auto",
                  mx: "auto",
                  mb: "16px",
                  backgroundColor: "rgba(50, 55, 64, 0.102)",
                  color: "#323740",
                  "&:hover": {
                    backgroundColor: "rgba(50, 55, 64, 0.2)",
                  },
                }}
              >
                Upload Image
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                fullWidth
                sx={{
                  mt: "auto",
                  mx: "auto",
                  backgroundColor: "rgba(241, 86, 66, 0.102)",
                  color: "#F15642",
                  "&:hover": {
                    backgroundColor: "rgba(241, 86, 66, 0.2)",
                  },
                }}
              >
                Delete Image
              </Button>
            </Box>
          </DetailsCard>
          <DetailsCard headingText="Change Password">
            <Box
              component="form"
              onSubmit={handlePasswordSubmit}
              sx={{ "& .MuiBox-root.css-4ffsol": { margin: "0" } }}
            >
              <CustomInput
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                handleChange={handlePasswordChange}
                placeholder="Enter current password"
                inputBoxSX={{ mb: "16px" }}
              />
              <CustomInput
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                handleChange={handlePasswordChange}
                placeholder="Enter new password"
                inputBoxSX={{ mb: "16px" }}
              />
              <CustomInput
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                handleChange={handlePasswordChange}
                placeholder="Confirm new password"
                inputBoxSX={{ mb: "16px" }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  display: "flex",
                  mx: "auto",
                  backgroundColor: "rgba(50, 55, 64, 0.102)",
                  color: "#323740",
                  "&:hover": {
                    backgroundColor: "rgba(50, 55, 64, 0.2)",
                  },
                }}
              >
                Save changes
              </Button>
            </Box>
          </DetailsCard>
        </Grid>
      </Box>
    </>
  );
};

export default Profile;
