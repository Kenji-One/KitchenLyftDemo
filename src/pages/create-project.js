"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  OutlinedInput,
  FormControl,
  IconButton,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomInput from "@/components/helpers/CustomInput";
import Loader from "@/utils/Loader";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

const CreateProject = () => {
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    if (!description) newErrors.description = "Notes is required";
    if (!location) newErrors.location = "Location is required";
    if (!priority) newErrors.priority = "Priority is required";
    if (!startDate) newErrors.startDate = "StartDate is required";
    return newErrors;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });
    formData.append("description", description);
    formData.append("location", location);
    formData.append("priority", priority);
    // formData.append("status", status);
    formData.append("startDate", startDate.toISOString());

    const response = await fetch("/api/projects", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setLoading(false);
      router.push("/");
    } else {
      console.error("Failed to create project");
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push("/");
  };
  return (
    <>
      <Loader open={loading} />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 974, mx: "auto", mt: { xs: "82px", lg2: 4 }, px: 2 }}
        encType="multipart/form-data"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            gap: "8xp",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "20px", xs2: "24px" },
              textTransform: "uppercase",
            }}
          >
            Create a Project
          </Typography>
          <Button
            type="submit"
            variant="greenBtn"
            color="primary"
            disabled={!description || !priority || !location || !startDate}
          >
            Save
          </Button>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md2: "1fr 1fr" },
            gap: "24px",
          }}
        >
          <Box sx={{ mb: "24px" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  xs3: "1fr 1fr",
                  sm: "1fr 1fr 1fr",
                },
                gridTemplateRows: { xs: "unset", md2: "266px 113px" },
                gap: "5px",
              }}
            >
              {images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    gridColumn: index === 0 && "1/-1",
                  }}
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`preview-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "red",
                      backgroundColor: "none",
                      borderRadius: "4px",
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Box
                sx={{
                  maxHeight: { xs: "100%", md2: "113px" },
                  border: "1px dashed #ccc",
                  borderRadius: "4px",
                  padding: "16px",
                  paddingBottom: "12px",
                  textAlign: "center",
                  cursor: "pointer",
                  position: "relative",
                  height: "150px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: { xs: "center", md2: "end" },
                  alignItems: "center",
                  backgroundColor: "rgba(50, 55, 64, 0.1)",
                  "&:hover": {
                    borderColor: "#000",
                  },
                }}
                onClick={() => document.getElementById("file-input").click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <AddIcon fontSize="small" sx={{ color: "#323740" }} />
                </Box>
                <Typography
                  variant="inputHeading"
                  sx={{
                    mt: "12px",
                    textTransform: "unset",
                    fontWeight: "600",
                    color: "rgba(50, 55, 64, 0.6)",
                  }}
                >
                  max 3MBs
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box>
            <FormControl fullWidth sx={{ mb: "24px" }}>
              {/* <InputLabel>Location</InputLabel> */}
              <Typography variant="inputHeading">Location</Typography>
              <Select
                sx={{ height: "44px" }}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                labelId="location-label"
                name={"location"}
                displayEmpty
                input={<OutlinedInput />}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem disabled value="">
                  Select Location
                </MenuItem>
                <MenuItem value="Montreal">Montreal</MenuItem>
                <MenuItem value="Miami">Miami</MenuItem>
                <MenuItem value="New York">New York</MenuItem>
                <MenuItem value="New Jersey">New Jersey</MenuItem>
                <MenuItem value="Toronto">Toronto</MenuItem>
                {/* Add more locations as needed */}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: "24px" }}>
              {/* <InputLabel>Priority</InputLabel> */}
              <Typography variant="inputHeading">Priority</Typography>

              <Select
                sx={{ height: "44px" }}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                labelId="role-label"
                name={"priority"}
                displayEmpty
                input={<OutlinedInput />}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem disabled value="">
                  Select Priority
                </MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
              </Select>
            </FormControl>
            <CustomInput
              label="Notes"
              type="textarea"
              value={description}
              handleChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              inputBoxSX={{ mb: "24px" }}
              error={errors.description}
              helperText={errors.description}
            />

            <Box sx={{ mb: "24px" }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  lineHeight: "14.4px",
                  color: "text.primary",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  mb: "6px",
                }}
              >
                Start Date
              </Typography>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                customInput={<OutlinedInput />}
              />
              {errors.startDate && (
                <Typography
                  sx={{
                    color: "error.main",
                    fontSize: "12px",
                    mt: "4px",
                  }}
                >
                  {errors.startDate}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleGoBack}
          sx={{
            position: "absolute",
            top: { xs: "24px", lg2: "32px" },
            left: { xs: "16px", md2: "32px" },
          }}
        >
          Go Back
        </Button>
      </Box>
    </>
  );
};

export default CreateProject;
