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

// const pricing = {
//   doors: {
//     materials: { wood: 50, metal: 100, plastic: 30 },
//     sizes: { small: 20, medium: 40, large: 60 },
//   },
//   drawerFronts: {
//     materials: { wood: 40, metal: 80, plastic: 25 },
//     sizes: { small: 15, medium: 30, large: 45 },
//   },
//   sidePanels: {
//     materials: { wood: 60, metal: 120, plastic: 40 },
//     sizes: { small: 25, medium: 50, large: 75 },
//   },
//   kickPlates: {
//     materials: { wood: 30, metal: 60, plastic: 20 },
//     sizes: { small: 10, medium: 20, large: 30 },
//   },
//   trim: {
//     materials: { brass: 20, stainlessSteel: 40, plastic: 10 },
//     sizes: { small: 8, medium: 16, large: 24 },
//   },
//   handles: {
//     materials: { brass: 20, stainlessSteel: 40, plastic: 10 },
//     sizes: { small: 8, medium: 16, large: 24 },
//   },
//   hinges: {
//     materials: { brass: 20, stainlessSteel: 40, plastic: 10 },
//     sizes: { small: 8, medium: 16, large: 24 },
//   },
// };

const marketPrices = {
  melamine: 30,
  PET: 45,
};

const categoriesWithFormulas = [
  "doors",
  "drawerFronts",
  "sidePanels",
  "kickPlates",
  "trim",
];

const categoriesWithStandardPrices = ["handles", "hinges", "extras"];

const GenerateQuoteForm = ({ selectedProject }) => {
  const [loading, setLoading] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState({
    projectTemplate: selectedProject,
    doors: [{ material: "", width: "", height: "", quantity: "" }],
    drawerFronts: [{ material: "", width: "", height: "", quantity: "" }],
    sidePanels: [{ material: "", width: "", height: "", quantity: "" }],
    kickPlates: [{ material: "", width: "", height: "", quantity: "" }],
    trim: [{ material: "", width: "", height: "", quantity: "" }],
    handles: [{ sku: "", quantity: "" }],
    hinges: [{ sku: "", quantity: "" }],
    extras: [{ sku: "", quantity: "" }],
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const calculateTotalAmount = () => {
      let total = 0;

      categoriesWithFormulas.forEach((category) => {
        quoteDetails[category].forEach((item) => {
          const materialPrice = marketPrices[item.material] || 0;
          const size =
            (parseFloat(item.width) || 0) * (parseFloat(item.height) || 0);
          const quantity = parseInt(item.quantity) || 0;
          total += quantity * (materialPrice * (size / 144));
        });
      });

      categoriesWithStandardPrices.forEach((category) => {
        quoteDetails[category].forEach((item) => {
          // Assuming standard prices are to be fetched later, here using placeholder values
          const price = 10; // Placeholder price
          const quantity = parseInt(item.quantity) || 0;
          total += price * quantity;
        });
      });

      setTotalAmount(Math.round(total));
    };

    calculateTotalAmount();
  }, [quoteDetails]);

  const handleInputChange = (event, category, index) => {
    const { name, value } = event.target;
    setQuoteDetails((prevDetails) => {
      const updatedCategory = [...prevDetails[category]];
      updatedCategory[index] = { ...updatedCategory[index], [name]: value };
      return { ...prevDetails, [category]: updatedCategory };
    });
  };

  const handleAddItem = (category) => {
    const newItem = categoriesWithFormulas.includes(category)
      ? { material: "", width: "", height: "", quantity: "" }
      : { sku: "", quantity: "" };
    setQuoteDetails((prevDetails) => ({
      ...prevDetails,
      [category]: [...prevDetails[category], newItem],
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
        projectId: selectedProject._id,
        price: totalAmount,
      }),
    });

    if (response.ok) {
      setLoading(false);
      setSuccessMessage("Quote generated successfully!");
      setQuoteDetails({
        projectTemplate: "",
        doors: [{ material: "", width: "", height: "", quantity: "" }],
        drawerFronts: [{ material: "", width: "", height: "", quantity: "" }],
        sidePanels: [{ material: "", width: "", height: "", quantity: "" }],
        kickPlates: [{ material: "", width: "", height: "", quantity: "" }],
        trim: [{ material: "", width: "", height: "", quantity: "" }],
        handles: [{ sku: "", quantity: "" }],
        hinges: [{ sku: "", quantity: "" }],
        extras: [{ sku: "", quantity: "" }],
      });
      setTimeout(() => {
        setSuccessMessage("");
        router.refresh();
      }, 3000);
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
        sx={{ maxWidth: "974px", mx: "auto", mt: 4, marginBottom: "48px" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "24px",
            mb: 4,
          }}
        >
          <Typography variant="h2">Generate Quote</Typography>
          <Button
            type="submit"
            variant="greenBtn"
            color="primary"
            fullWidth
            sx={{ width: "auto" }}
          >
            Generate
          </Button>
        </Box>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 4 }}>
            {successMessage}
          </Alert>
        )}
        <Box
          sx={{
            width: "100%",
            height: "148px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#323740",
            color: "#FFFFFF",
            marginBottom: "24px",
          }}
        >
          <Typography sx={{ fontSize: "16px", fontWeight: "600" }}>
            Current Quote
          </Typography>
          <Typography
            sx={{
              fontFamily: "Paytone One",
              fontSize: "52px",
              fontWeight: "400",
            }}
          >
            ${totalAmount}
          </Typography>
        </Box>
        <Box
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px " }}
        >
          {[...categoriesWithFormulas, ...categoriesWithStandardPrices].map(
            (category) => (
              <Box key={category}>
                <Typography variant="h6" sx={{ mb: "14px" }}>
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
                    <Typography
                      variant="h6"
                      sx={{ mb: "!2px", fontSize: "12px", gridColumn: "1/-1" }}
                    >
                      {category.replace(/([A-Z])/g, " $1")} #{index + 1}
                    </Typography>
                    {categoriesWithFormulas.includes(category) ? (
                      <>
                        <Box sx={{ gridColumn: "1/-1" }}>
                          <FormControl fullWidth>
                            <Select
                              sx={{ height: "44px" }}
                              labelId="material-label"
                              value={item.material}
                              onChange={(e) =>
                                handleInputChange(e, category, index)
                              }
                              name="material"
                              displayEmpty
                              inputProps={{ "aria-label": "Without label" }}
                              input={<OutlinedInput />}
                            >
                              <MenuItem disabled value="">
                                Select Material
                              </MenuItem>
                              {Object.keys(marketPrices).map(
                                (material, idx) => (
                                  <MenuItem key={idx} value={material}>
                                    {material}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </Box>
                        {/* <Box>
                          <FormControl fullWidth size="medium">
                            <Select
                              sx={{ height: "44px" }}
                              value={item.size}
                              labelId="size-label"
                              onChange={(e) =>
                                handleInputChange(e, category, index)
                              }
                              name="size"
                              displayEmpty
                              input={<OutlinedInput />}
                              inputProps={{ "aria-label": "Without label" }}
                            >
                              <MenuItem disabled value="">
                                Select Size
                              </MenuItem>
                              {Object.keys(pricing[category].sizes).map(
                                (size, idx) => (
                                  <MenuItem key={idx} value={size}>
                                    {size}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </Box> */}
                        <Box>
                          <CustomInput
                            type="text"
                            value={item.width}
                            handleChange={(e) =>
                              handleInputChange(e, category, index)
                            }
                            placeholder="Width (in inches)"
                            inputName="width"
                          />
                        </Box>
                        <Box>
                          <CustomInput
                            type="text"
                            value={item.height}
                            handleChange={(e) =>
                              handleInputChange(e, category, index)
                            }
                            placeholder="Height (in inches)"
                            inputName="height"
                          />
                        </Box>
                      </>
                    ) : (
                      <Box>
                        <CustomInput
                          type="text"
                          value={item.sku}
                          handleChange={(e) =>
                            handleInputChange(e, category, index)
                          }
                          placeholder="Enter SKU"
                          inputName="sku"
                        />
                      </Box>
                    )}
                    <Box>
                      <CustomInput
                        // label="Quantity"
                        type="text"
                        value={item.quantity}
                        handleChange={(e) =>
                          handleInputChange(e, category, index)
                        }
                        placeholder="Enter Quantity"
                        inputName="quantity"
                      />
                    </Box>
                    {/* <IconButton
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
                </IconButton> */}
                  </Box>
                ))}
                <Box sx={{ width: "100%", display: "flex" }}>
                  <Button
                    onClick={() => handleAddItem(category)}
                    variant="btnGray"
                    color="primary"
                    sx={{
                      padding: "12px 16px",
                      textAlign: "center",
                      marginBottom: "0",
                    }}
                  >
                    Add Another {category.replace(/([A-Z])/g, " $1")}
                  </Button>
                </Box>
              </Box>
            )
          )}
        </Box>
      </Box>
    </>
  );
};

export default GenerateQuoteForm;
