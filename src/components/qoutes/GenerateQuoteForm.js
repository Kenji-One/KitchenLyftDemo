"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  OutlinedInput,
  Grid,
  IconButton,
  Alert,
} from "@mui/material";
import CustomInput from "@/components/helpers/CustomInput";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/utils/Loader";

const pricing = {
  doors: {
    materials: { wood: 50, metal: 100, plastic: 30 },
    sizes: { small: 20, medium: 40, large: 60 },
  },
  drawerFronts: {
    materials: { wood: 40, metal: 80, plastic: 25 },
    sizes: { small: 15, medium: 30, large: 45 },
  },
  sidePanels: {
    materials: { wood: 60, metal: 120, plastic: 40 },
    sizes: { small: 25, medium: 50, large: 75 },
  },
  kickPlates: {
    materials: { wood: 30, metal: 60, plastic: 20 },
    sizes: { small: 10, medium: 20, large: 30 },
  },
  handles: {
    materials: { brass: 20, stainlessSteel: 40, plastic: 10 },
    sizes: { small: 8, medium: 16, large: 24 },
  },
  extras: {
    materials: { custom1: 70, custom2: 100, custom3: 50 },
    sizes: { small: 30, medium: 60, large: 90 },
  },
};

const categories = [
  "doors",
  "drawerFronts",
  "sidePanels",
  "kickPlates",
  "handles",
  "extras",
];

const GenerateQuoteForm = ({ projects }) => {
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [quoteDetails, setQuoteDetails] = useState({
    projectTemplate: "",
    doors: [],
    drawerFronts: [],
    sidePanels: [],
    kickPlates: [],
    handles: [],
    extras: [],
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (selectedProject) {
      const project = projects.find((p) => p._id === selectedProject);
      if (project) {
        setQuoteDetails((prevDetails) => ({
          ...prevDetails,
          projectTemplate: project.title,
        }));
      }
    }
  }, [selectedProject, projects]);

  useEffect(() => {
    const calculateTotalAmount = () => {
      let total = 0;
      for (const category in quoteDetails) {
        if (category !== "projectTemplate") {
          quoteDetails[category].forEach((item) => {
            total +=
              (pricing[category].materials[item.material] || 0) *
              (pricing[category].sizes[item.size] || 0) *
              (parseInt(item.quantity) || 0);
          });
        }
      }
      setTotalAmount(total);
    };

    calculateTotalAmount();
  }, [quoteDetails]);

  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
  };

  const handleInputChange = (event, category, index) => {
    const { name, value } = event.target;
    setQuoteDetails((prevDetails) => {
      const updatedCategory = [...prevDetails[category]];
      updatedCategory[index] = { ...updatedCategory[index], [name]: value };
      return { ...prevDetails, [category]: updatedCategory };
    });
  };

  const handleAddItem = (category) => {
    setQuoteDetails((prevDetails) => ({
      ...prevDetails,
      [category]: [
        ...prevDetails[category],
        { name: "", material: "", size: "", quantity: "" },
      ],
    }));
  };

  const handleRemoveItem = (category, index) => {
    setQuoteDetails((prevDetails) => {
      const updatedCategory = [...prevDetails[category]];
      updatedCategory.splice(index, 1);
      return { ...prevDetails, [category]: updatedCategory };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...quoteDetails,
        projectId: selectedProject,
        price: totalAmount,
      }),
    });

    if (response.ok) {
      setLoading(false);
      setSuccessMessage("Quote generated successfully!");
      setQuoteDetails({
        projectTemplate: "",
        doors: [],
        drawerFronts: [],
        sidePanels: [],
        kickPlates: [],
        handles: [],
        extras: [],
      });
      setSelectedProject("");
      setTimeout(() => {
        setSuccessMessage("");
        router.push("/");
      }, 10000);
    } else {
      console.error("Failed to generate quote");
    }
  };

  return (
    <>
      <Loader open={loading} />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 800, mx: "auto", mt: 4 }}
      >
        <Typography variant="h4" sx={{ mb: 4 }}>
          Generate Quote
        </Typography>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 4 }}>
            {successMessage}
          </Alert>
        )}
        <FormControl fullWidth size="medium" sx={{ mb: 4 }}>
          <Select
            sx={{ height: "44px" }}
            value={selectedProject}
            onChange={handleProjectChange}
            labelId="select-project"
            name={"projects"}
            displayEmpty
            input={<OutlinedInput />}
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem disabled value="">
              Select Project
            </MenuItem>
            {projects.map((project) => (
              <MenuItem key={project._id} value={project._id}>
                {project.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Quote Form
        </Typography>
        <CustomInput
          label="Project Template"
          type="text"
          value={quoteDetails.projectTemplate}
          handleChange={(e) =>
            setQuoteDetails({
              ...quoteDetails,
              projectTemplate: e.target.value,
            })
          }
          placeholder="Enter project template"
          inputBoxSX={{ mb: "24px" }}
        />

        {categories.map((category) => (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {category.replace(/([A-Z])/g, " $1")}
            </Typography>
            {quoteDetails[category].map((item, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  position: "relative",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                {category === "extras" && (
                  <Box sx={{ gridColumn: "1/-1" }}>
                    <CustomInput
                      label="Name"
                      type="text"
                      value={item.name}
                      handleChange={(e) =>
                        handleInputChange(e, category, index)
                      }
                      placeholder="Enter Extra Name"
                      inputName="name"
                    />
                  </Box>
                )}
                <Box sx={{ gridColumn: "1/-1" }}>
                  <FormControl fullWidth>
                    <Select
                      sx={{ height: "44px" }}
                      labelId="material-label"
                      value={item.material}
                      onChange={(e) => handleInputChange(e, category, index)}
                      name="material"
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      input={<OutlinedInput />}
                    >
                      <MenuItem disabled value="">
                        Select Material
                      </MenuItem>
                      {Object.keys(pricing[category].materials).map(
                        (material, idx) => (
                          <MenuItem key={idx} value={material}>
                            {material}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <FormControl fullWidth size="medium">
                    <Select
                      sx={{ height: "44px" }}
                      value={item.size}
                      labelId="size-label"
                      onChange={(e) => handleInputChange(e, category, index)}
                      name="size"
                      displayEmpty
                      input={<OutlinedInput />}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem disabled value="">
                        Select Size
                      </MenuItem>
                      {Object.keys(pricing[category].sizes).map((size, idx) => (
                        <MenuItem key={idx} value={size}>
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <CustomInput
                    // label="Quantity"
                    type="text"
                    value={item.quantity}
                    handleChange={(e) => handleInputChange(e, category, index)}
                    placeholder="Enter Quantity"
                    inputName="quantity"
                  />
                </Box>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveItem(category, index)}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: -40,
                    transform: "translateY(-50%)",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              onClick={() => handleAddItem(category)}
              variant="contained"
              color="primary"
            >
              Add {category.replace(/([A-Z])/g, " $1")}
            </Button>
          </Box>
        ))}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Total Amount: ${totalAmount}
        </Typography>
        <Button
          type="submit"
          variant="greenBtn"
          color="primary"
          fullWidth
          sx={{ mt: 5, mb: 6, width: "auto" }}
        >
          Generate Quote
        </Button>
      </Box>
    </>
  );
};

export default GenerateQuoteForm;
