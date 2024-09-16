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
  IconButton,
  Alert,
} from "@mui/material";
import CustomInput from "@/components/helpers/CustomInput";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/utils/Loader";

const marketPrices = {
  melamine: 30,
  PET: 45,
  hinges: 3, // Price per hinge
};

const handleSKUs = [
  {
    sku: "HKL 1",
    description: "Modern Metal Pull Gold",
    price: 10,
    productNumber: "#BP87396158",
  },
  {
    sku: "HKL 2",
    description: "Modern Metal Pull Matte Black",
    price: 10,
    productNumber: "#BP7470128900",
  },
  {
    sku: "HKL 3",
    description: "Modern Metal Pull Brushed Nickel",
    price: 10,
    productNumber: "#BP7470128195",
  },
  {
    sku: "HKL 4",
    description: "Modern Metal Pull Nickel",
    price: 8,
    productNumber: "#6132896195",
  },
  {
    sku: "HKL 5",
    description: "Modern Metal Pull Brushed Bronze",
    price: 8,
    productNumber: "#BP820128BORB",
  },
  {
    sku: "HKL 6",
    description: "Modern Metal Pull Grey",
    price: 8,
    productNumber: "#BP2323128195",
  },
  {
    sku: "HKL 7",
    description: "Modern Metal Pull Straight",
    price: 8,
    productNumber: "#458192195TT",
  },
  {
    sku: "HKL 8",
    description: "Modern Metal Pull Chrome",
    price: 9,
    productNumber: "#BP6969128140",
  },
  {
    sku: "HKL 9",
    description: "Modern Aluminum Pull",
    price: 8,
    productNumber: "#BP46013210",
  },
  {
    sku: "HKL 10",
    description: "Modern Edge Pull Gold",
    price: 10,
    productNumber: "#BP989880166",
  },
  {
    sku: "HKL 11",
    description: "Modern Metal Knob Gold",
    price: 10,
    productNumber: "#BP5139632CHBRZ",
  },
  {
    sku: "HKL 12",
    description: "Modern Metal Knob Nickel",
    price: 6,
    productNumber: "#BP879040195",
  },
  {
    sku: "HKL 13",
    description: "Modern Metal Knob Bronze",
    price: 7,
    productNumber: "#BP734544CHBRZ",
  },
  {
    sku: "HKL 14",
    description: "Transitional Metal Knob",
    price: 9,
    productNumber: "#BP722740195",
  },
  {
    sku: "HKL 15",
    description: "Modern Plastic Knob",
    price: 5,
    productNumber: "#BP234725166",
  },
];

const melamineMaterialColors = [
  {
    sku: "KL 1",
    catalog: "WMK-057-B",
    color: "Natural Grey-KL1",
    material: "Melamine",
    image: "/colors/Natural Grey-KL1.jpg",
  },
  {
    sku: "KL 2",
    catalog: "WMK-080",
    color: "Sunset Grey-KL2",
    material: "Melamine",
    image: "/colors/Sunset Grey-KL2.jpeg",
  },
  {
    sku: "KL 3",
    catalog: "WMK-081",
    color: "Black-KL3",
    material: "Melamine",
    image: "/colors/Black-KL3.jpg",
  },
  {
    sku: "KL 4",
    catalog: "WMK-082-G",
    color: "White-KL4",
    material: "Melamine",
    image: "/colors/White-KL4.png",
  },
  {
    sku: "KL 5",
    catalog: "WMK-088-B",
    color: "Dark Grey-KL5",
    material: "Melamine",
    image: "/colors/Dark Grey-KL5.jpg",
  },
  {
    sku: "KL 6",
    catalog: "WMK-089",
    color: "Grey-KL6",
    material: "Melamine",
    image: "/colors/Grey-KL6.jpg",
  },
  {
    sku: "KL 7",
    catalog: "WMK-095",
    color: "Glossy White-KL7",
    material: "Melamine",
    image: "/colors/Glossy White-KL7.png",
  },
  {
    sku: "KL 8",
    catalog: "WMK-006-B",
    color: "Nogal Wood-KL8",
    material: "Melamine",
    image: "/colors/Nogal Wood-KL8.jpg",
  },
  {
    sku: "KL 9",
    catalog: "WMK-009-C",
    color: "Fresno Wood-KL9",
    material: "Melamine",
    image: "/colors/Fresno Wood-KL9.jpg",
  },
  {
    sku: "KL 10",
    catalog: "WMK-019",
    color: "Glacial Wood-KL10",
    material: "Melamine",
    image: "/colors/Glacial Wood-KL10.jpg",
  },
  {
    sku: "KL 11",
    catalog: "WMK-020-B",
    color: "Dark Wood-KL11",
    material: "Melamine",
    image: "/colors/Dark Wood-KL11.jpeg",
  },
  {
    sku: "KL 12",
    catalog: "WMK-021",
    color: "Dark Oak Wood-KL12",
    material: "Melamine",
    image: "/colors/Dark Oak Wood-KL12.jpg",
  },
  {
    sku: "KL 13",
    catalog: "WMK-022",
    color: "Beige Wood-KL13",
    material: "Melamine",
    image: "/colors/Beige Wood-KL13.jpg",
  },
  {
    sku: "KL 14",
    catalog: "WMK-041-B",
    color: "White Wood-KL14",
    material: "Melamine",
    image: "/colors/White Wood-KL14.png",
  },
  {
    sku: "KL 15",
    catalog: "WMK-042",
    color: "Grey Wood-KL15",
    material: "Melamine",
    image: "/colors/Grey Wood-KL15.png",
  },
  {
    sku: "KL 16",
    catalog: "WMK-043-B",
    color: "Black Wood-KL16",
    material: "Melamine",
    image: "/colors/Black Wood-KL16.png",
  },
  {
    sku: "KL 17",
    catalog: "WMK-015-B",
    color: "Dark Grey Wood-KL17",
    material: "Melamine",
    image: "/colors/Dark Grey Wood-KL17.jpg",
  },
];

const petMaterialColors = [
  {
    sku: "KL 18",
    catalog: "WMK-082-G",
    color: "White-KL18",
    material: "PET",
    image: "/colors/White-KL18.png",
  },
  {
    sku: "KL 19",
    catalog: "WMK-089",
    color: "Grey-KL19",
    material: "PET",
    image: "/colors/Grey-KL19.jpg",
  },
  {
    sku: "KL 20",
    catalog: "WMK-080",
    color: "Sunset Grey-KL20",
    material: "PET",
    image: "/colors/Sunset Grey-KL20.jpg",
  },
  {
    sku: "KL 21",
    catalog: "WMK-088-B",
    color: "Dark Grey-KL21",
    material: "PET",
    image: "/colors/Dark Grey-KL21.png",
  },
  {
    sku: "KL 22",
    catalog: "WMK-020-B",
    color: "Dark Wood-KL22",
    material: "PET",
    image: "/colors/Dark Wood-KL22.png",
  },
  {
    sku: "KL 23",
    catalog: "WMK-081",
    color: "Black-KL23",
    material: "PET",
    image: "/colors/Black-KL23.png",
  },
  {
    sku: "KL 24",
    catalog: "WMK-095",
    color: "Glossy White-KL24",
    material: "PET",
    image: "/colors/Glossy White-KL24.png",
  },
  {
    sku: "KL 25",
    catalog: "WMK-057-B",
    color: "Natural Grey-KL25",
    material: "PET",
    image: "/colors/Natural Grey-KL25.jpg",
  },
];

const finishingTouchSKUs = [
  { sku: "FTKL 1 (KL 1 and KL 25)", catalog: "WMK-057-B" },
  { sku: "FTKL 2 (KL 2 and KL 20)", catalog: "WMK-080" },
  { sku: "FTKL 3 (KL 3 and KL 23)", catalog: "WMK-081" },
  { sku: "FTKL 4 (KL 4 and KL 18)", catalog: "WMK-082-G" },
  { sku: "FTKL 5 (KL 5 and KL 21)", catalog: "WMK-088-B" },
  { sku: "FTKL 6 (KL 6 and KL 19)", catalog: "WMK-089" },
  { sku: "FTKL 7 (KL 7 and KL 24)", catalog: "WMK-095" },
  { sku: "FTKL 8 (KL 8)", catalog: "WMK-006-B" },
  { sku: "FTKL 9 (KL 9)", catalog: "WMK-009-C" },
  { sku: "FTKL 10 (KL 10)", catalog: "WMK-019" },
  { sku: "FTKL 11 (KL 11 and KL 22)", catalog: "WMK-020-B" },
  { sku: "FTKL 12 (KL 12)", catalog: "WMK-021" },
  { sku: "FTKL 13 (KL 13)", catalog: "WMK-022" },
  { sku: "FTKL 14 (KL 14)", catalog: "WMK-041-B" },
  { sku: "FTKL 15 (KL 15)", catalog: "WMK-042" },
  { sku: "FTKL 16 (KL 16)", catalog: "WMK-043-B" },
  { sku: "FTKL 17 (KL 17)", catalog: "WMK-015-B" },
];

const hingesSKUs = [
  { sku: "Normal Soft Close Hinges", price: 3 },
  { sku: "Face Frame Hinges", price: 3 },
];

const categoriesWithFormulas = [
  "doors",
  "drawerFronts",
  "sidePanels",
  "kickPlates",
  "trim",
  "finishingTouch",
];

const categoriesWithStandardPrices = ["handles", "hinges"];

const GenerateQuoteForm = ({
  quote,
  selectedProject,
  setThereIsClickForQoute,
  handleProjectClick,
}) => {
  const [loading, setLoading] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState(
    quote || {
      projectTemplate: selectedProject,
      doors: [
        {
          material: "",
          width: "",
          height: "",
          quantity: "",
          color: "",
          sku: { skuCode: "", catalog: "" },
        },
      ],
      drawerFronts: [
        {
          material: "",
          width: "",
          height: "",
          quantity: "",
          color: "",
          sku: { skuCode: "", catalog: "" },
        },
      ],
      sidePanels: [
        {
          material: "",
          width: "",
          height: "",
          quantity: "",
          color: "",
          sku: { skuCode: "", catalog: "" },
        },
      ],
      kickPlates: [
        {
          material: "",
          width: "",
          height: "",
          quantity: "",
          color: "",
          sku: { skuCode: "", catalog: "" },
        },
      ],
      trim: [
        {
          material: "",
          width: "",
          height: "",
          quantity: "",
          color: "",
          sku: { skuCode: "", catalog: "" },
        },
      ],
      finishingTouch: [
        {
          sku: { skuCode: "", catalog: "" },
          width: "",
          height: "",
          quantity: "",
        },
      ],
      handles: [
        { sku: { name: "", skuCode: "", productNumber: "" }, quantity: "" },
      ],
      hinges: [{ sku: "", quantity: "" }],
    }
  );
  const [totalAmount, setTotalAmount] = useState(0);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const calculateTotalAmount = () => {
      let total = 0;

      // Calculations for categories with formulas like doors, panels, etc.
      categoriesWithFormulas.forEach((category) => {
        quoteDetails[category].forEach((item) => {
          const materialPrice =
            category !== "finishingTouch"
              ? marketPrices[item.material] || 0
              : 3;
          const size =
            (parseFloat(item.width) || 0) * (parseFloat(item.height) || 0);
          const quantity = parseInt(item.quantity) || 0;
          // console.log("sizeee:", materialPrice * 0.6944444444444444);
          total += quantity * (materialPrice * (size / 144));
        });
      });

      // Calculations for handles using handleSKUs array
      if (quoteDetails.handles) {
        quoteDetails.handles.forEach((handle) => {
          const handleDetail =
            handleSKUs.find((h) => h.sku === handle.sku.skuCode) || {};
          total += handle.quantity * (handleDetail.price || 0);
        });
      }

      // Calculations for hinges using hingesSKUs array
      if (quoteDetails.hinges) {
        quoteDetails.hinges.forEach((hinge) => {
          const hingeDetail = hingesSKUs.find((h) => h.sku === hinge.sku) || {};
          total += hinge.quantity * (hingeDetail.price || 0);
        });
      }

      setTotalAmount(Math.round(total));
    };

    calculateTotalAmount();
  }, [quoteDetails]);

  const validateForm = () => {
    const newErrors = {};
    [...categoriesWithFormulas, ...categoriesWithStandardPrices].forEach(
      (category) => {
        quoteDetails[category].forEach((item, index) => {
          if (
            !item.material &&
            categoriesWithFormulas.includes(category) &&
            category !== "finishingTouch"
          ) {
            newErrors[`${category}-${index}-material`] = "Material is required";
          }
          if (!item.width && categoriesWithFormulas.includes(category)) {
            newErrors[`${category}-${index}-width`] = "Width is required";
          }
          if (!item.height && categoriesWithFormulas.includes(category)) {
            newErrors[`${category}-${index}-height`] = "Height is required";
          }
          if (!item.quantity) {
            newErrors[`${category}-${index}-quantity`] = "Quantity is required";
          }
          if (
            !item.color &&
            [
              "doors",
              "drawerFronts",
              "sidePanels",
              "kickPlates",
              "trim",
            ].includes(category)
          ) {
            newErrors[`${category}-${index}-color`] = "Color is required";
          }
          if (category === "handles" && !item.sku.skuCode) {
            newErrors[`${category}-${index}-sku`] = "Handle SKU is required";
          }
          if (category === "hinges" && !item.sku) {
            newErrors[`${category}-${index}-sku`] = "Hinge SKU is required";
          }
          if (category === "finishingTouch" && !item.sku.skuCode) {
            newErrors[`${category}-${index}-sku`] =
              "Finishing touch SKU is required";
          }
        });
      }
    );
    return newErrors;
  };

  const handleInputChange = (event, category, index) => {
    const { name, value } = event.target;
    let updatedQuoteDetails = { ...quoteDetails };

    if (category === "doors" && name === "quantity") {
      // Parse new value and update the specific door's quantity
      const updatedQuantity = parseInt(value) || 0;
      updatedQuoteDetails.doors[index] = {
        ...updatedQuoteDetails.doors[index],
        quantity: updatedQuantity,
      };

      // Recalculate total doors quantity immediately
      const totalDoorsQuantity = updatedQuoteDetails.doors.reduce(
        (total, door) => total + (parseInt(door.quantity) || 0),
        0
      );

      // Update hinges quantity based on the new total
      updatedQuoteDetails.hinges[0] = {
        ...updatedQuoteDetails.hinges[0],
        quantity: totalDoorsQuantity * 2,
      };
    }

    // Handle material and color selections for categories with these attributes
    if (
      name === "color" &&
      ["doors", "drawerFronts", "sidePanels", "kickPlates", "trim"].includes(
        category
      )
    ) {
      const materialType = updatedQuoteDetails[category][index].material;
      const colorArray =
        materialType === "melamine"
          ? melamineMaterialColors
          : petMaterialColors;
      const colorDetails = colorArray.find((c) => c.color === value);

      // Update the state with the new color details
      updatedQuoteDetails[category][index] = {
        ...updatedQuoteDetails[category][index],
        color: value,
        sku: { skuCode: colorDetails.sku, catalog: colorDetails.catalog },
      };
    } else {
      // Update non-color attributes normally
      updatedQuoteDetails[category][index] = {
        ...updatedQuoteDetails[category][index],
        [name]: value,
      };
    }

    // Handle specific categories like handles, hinges, and finishing touches
    if (category === "handles" && name === "sku") {
      const handleDetails = handleSKUs.find((h) => h.sku === value);
      updatedQuoteDetails.handles[index] = {
        ...updatedQuoteDetails.handles[index],
        sku: {
          name: handleDetails.description,
          skuCode: handleDetails.sku,
          productNumber: handleDetails.productNumber,
        }, // Assuming SKU is the product number
        quantity: updatedQuoteDetails.handles[index].quantity,
      };
    } else if (category === "hinges" && name === "sku") {
      updatedQuoteDetails.hinges[index] = {
        ...updatedQuoteDetails.hinges[index],
        sku: value, // No additional details are specified for hinges
        quantity: updatedQuoteDetails.hinges[index].quantity,
      };
    } else if (category === "finishingTouch" && name === "sku") {
      const finishingDetails = finishingTouchSKUs.find((f) => f.sku === value);
      updatedQuoteDetails.finishingTouch[index] = {
        ...updatedQuoteDetails.finishingTouch[index],
        sku: {
          skuCode: finishingDetails.sku,
          catalog: finishingDetails.catalog,
        },
        quantity: updatedQuoteDetails.finishingTouch[index].quantity,
      };
    }

    setQuoteDetails(updatedQuoteDetails);
  };

  const handleAddItem = (category) => {
    const newItem = categoriesWithFormulas.includes(category)
      ? {
          material: "",
          width: "",
          height: "",
          quantity: "",
          color: "",
          sku: { skuCode: "", catalog: "" },
        }
      : category === "handles"
      ? { sku: { name: "", skuCode: "", productNumber: "" }, quantity: "" }
      : category === "finishingTouch"
      ? {
          sku: { skuCode: "", catalog: "" },
          width: "",
          height: "",
          quantity: "",
        }
      : { sku: "", quantity: "" };
    setQuoteDetails((prev) => ({
      ...prev,
      [category]: [...prev[category], newItem],
    }));
  };

  const handleRemoveItem = (category, index) => {
    setQuoteDetails((prevDetails) => {
      const updatedCategory = [...prevDetails[category]];
      updatedCategory.splice(index, 1);

      // Create a new quoteDetails object with the updated category
      let updatedQuoteDetails = { ...prevDetails, [category]: updatedCategory };

      // Special handling for dependent fields or calculations
      if (category === "doors") {
        // Recalculate the total doors quantity after removal
        const totalDoorsQuantity = updatedQuoteDetails.doors.reduce(
          (total, door) => total + (parseInt(door.quantity) || 0),
          0
        );

        // Update hinges quantity based on the new total
        updatedQuoteDetails.hinges[0] = {
          ...updatedQuoteDetails.hinges[0],
          quantity: totalDoorsQuantity * 2,
        };
      }

      // Return the updated quoteDetails object
      return updatedQuoteDetails;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("quoteDetails:", quoteDetails);

    const validationErrors = validateForm();
    console.log("quoteDetails validate errors:", Object.keys(validationErrors));

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const method = quoteDetails?._id ? "PUT" : "POST";

    const response = await fetch("/api/quotes", {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...quoteDetails,
        projectId: selectedProject._id,
        price: totalAmount,
        quoteId: quoteDetails?._id || undefined,
      }),
    });

    if (response.ok) {
      setLoading(false);
      setSuccessMessage("Quote generated successfully!");

      setTimeout(() => {
        setSuccessMessage("");
        setThereIsClickForQoute(false);
        handleProjectClick(selectedProject._id);
      }, 2000);
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
            {quote ? "Save" : "Generate"}
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
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        gridColumn: "1/-1",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {category.replace(/([A-Z])/g, " $1")}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveItem(category, index)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: "!2px",
                        fontSize: "12px",
                        gridColumn: "1/-1",
                        textTransform: "capitalize",
                      }}
                    >
                      {category.replace(/([A-Z])/g, " $1")} #{index + 1}
                    </Typography>
                    {categoriesWithFormulas.includes(category) ? (
                      <>
                        {category !== "finishingTouch" ? (
                          <Box sx={{ gridColumn: "1/-1" }}>
                            <FormControl
                              fullWidth
                              error={!!errors[`${category}-${index}-material`]}
                            >
                              <Select
                                sx={{
                                  height: "44px",
                                  textTransform: "capitalize",
                                }}
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
                                  (material, idx) =>
                                    material !== "hinges" && (
                                      <MenuItem
                                        key={idx}
                                        value={material}
                                        sx={{ textTransform: "capitalize" }}
                                      >
                                        {material}
                                      </MenuItem>
                                    )
                                )}
                              </Select>
                            </FormControl>
                          </Box>
                        ) : (
                          <Box sx={{ gridColumn: "1/-1" }}>
                            <FormControl
                              fullWidth
                              error={!!errors[`${category}-${index}-sku`]}
                            >
                              <Select
                                sx={{ height: "44px" }}
                                labelId="finishingTouch-label"
                                value={item.sku.skuCode}
                                onChange={(e) =>
                                  handleInputChange(e, category, index)
                                }
                                name="sku"
                                displayEmpty
                                inputProps={{ "aria-label": "Without label" }}
                                input={<OutlinedInput />}
                              >
                                <MenuItem value="">Choose SKU</MenuItem>
                                {finishingTouchSKUs.map((handle) => (
                                  <MenuItem key={handle.sku} value={handle.sku}>
                                    {handle.sku}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        )}

                        <Box>
                          <CustomInput
                            type="number"
                            value={item.width}
                            handleChange={(e) =>
                              handleInputChange(e, category, index)
                            }
                            placeholder="Width (in inches)"
                            inputName="width"
                            error={errors[`${category}-${index}-width`]}
                          />
                        </Box>
                        <Box>
                          <CustomInput
                            type="number"
                            value={item.height}
                            handleChange={(e) =>
                              handleInputChange(e, category, index)
                            }
                            placeholder="Height (in inches)"
                            inputName="height"
                            error={errors[`${category}-${index}-height`]}
                          />
                        </Box>
                        {category !== "finishingTouch" && (
                          <FormControl
                            fullWidth
                            sx={{ gridColumn: "2" }}
                            disabled={!item.material}
                            error={!!errors[`${category}-${index}-color`]}
                          >
                            <Select
                              sx={{ height: "44px" }}
                              labelId="color-label"
                              value={item.color}
                              onChange={(e) =>
                                handleInputChange(e, category, index)
                              }
                              name="color"
                              displayEmpty
                              inputProps={{ "aria-label": "Without label" }}
                              input={<OutlinedInput />}
                            >
                              <MenuItem value="">Select Color</MenuItem>
                              {(item.material === "melamine"
                                ? melamineMaterialColors
                                : petMaterialColors
                              ).map((material) => (
                                <MenuItem
                                  key={material.catalog}
                                  value={material.color}
                                >
                                  <Box
                                    sx={{
                                      width: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    {material.color}
                                    <img
                                      src={material.image}
                                      alt={material.color}
                                      style={{
                                        width: 24,
                                        height: 24,
                                        marginRight: 8,
                                      }}
                                    />
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </>
                    ) : categoriesWithStandardPrices.includes("handles") &&
                      category === "handles" ? (
                      <Box>
                        <FormControl
                          fullWidth
                          error={!!errors[`${category}-${index}-sku`]}
                        >
                          <Select
                            sx={{ height: "44px" }}
                            labelId="handle-label"
                            value={item.sku.skuCode}
                            onChange={(e) =>
                              handleInputChange(e, "handles", index)
                            }
                            name="sku"
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            input={<OutlinedInput />}
                          >
                            <MenuItem value="">Choose SKU</MenuItem>
                            {handleSKUs.map((handle) => (
                              <MenuItem key={handle.sku} value={handle.sku}>
                                {handle.description} - ${handle.price}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    ) : category === "hinges" ? (
                      <Box>
                        <FormControl
                          fullWidth
                          error={!!errors[`${category}-${index}-sku`]}
                        >
                          <Select
                            sx={{ height: "44px" }}
                            labelId="hinges-label"
                            value={item.sku}
                            onChange={(e) =>
                              handleInputChange(e, "hinges", index)
                            }
                            name="sku"
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            input={<OutlinedInput />}
                          >
                            <MenuItem value="">Choose SKU</MenuItem>
                            {hingesSKUs.map((handle) => (
                              <MenuItem key={handle.sku} value={handle.sku}>
                                {handle.sku} - ${handle.price}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    ) : (
                      <Box>
                        <FormControl
                          fullWidth
                          error={!!errors[`${category}-${index}-sku`]}
                        >
                          <Select
                            sx={{ height: "44px" }}
                            labelId="finishingTouch-label"
                            value={item.sku}
                            onChange={(e) =>
                              handleInputChange(e, category, index)
                            }
                            name="sku"
                            displayEmpty
                            inputProps={{ "aria-label": "Without label" }}
                            input={<OutlinedInput />}
                          >
                            <MenuItem value="">Choose SKU</MenuItem>
                            {finishingTouchSKUs.map((handle) => (
                              <MenuItem key={handle.sku} value={handle.sku}>
                                {handle.sku}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    )}
                    <Box
                      sx={{
                        gridRow:
                          categoriesWithFormulas.includes(category) && "5",
                      }}
                    >
                      <CustomInput
                        type="number"
                        value={item.quantity}
                        handleChange={(e) =>
                          handleInputChange(e, category, index)
                        }
                        placeholder="Enter Quantity"
                        inputName="quantity"
                        error={errors[`${category}-${index}-quantity`]}
                      />
                    </Box>
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
