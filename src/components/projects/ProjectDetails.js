"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MessageInput from "../messages/MessageInput";
import MessageList from "../messages/MessageList";
import ProjectStatusChip from "./ProjectStatusChip";
import CustomInput from "@/components/helpers/CustomInput";

const ProjectDetails = ({
  project,
  quote,
  chat,
  setSelectedProject,
  letsGenerateQuote,
  handleSend,
  setLoading,
}) => {
  const router = useRouter();
  const [markup, setMarkup] = useState(0);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date)
      ? new Intl.DateTimeFormat("default", {
          year: "numeric",
          month: "long",
          day: "2-digit",
        }).format(date)
      : "N/A";
  };

  const quoteCategories = [
    { name: "Doors", data: quote?.doors },
    { name: "Drawer Fronts", data: quote?.drawerFronts },
    { name: "Side Panels", data: quote?.sidePanels },
    { name: "Kick Plates", data: quote?.kickPlates },
    { name: "Trim", data: quote?.trim },
    { name: "Handles", data: quote?.handles },
    { name: "Hinges", data: quote?.handles },
    { name: "Finishing Touch", data: quote?.finishingTouch },
  ];

  const handleCompleteOrder = async () => {
    setLoading(true);

    const checkoutSession = await fetch("/api/orders/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: project._id,
        totalAmount: Math.round(
          quote.price * (1 + 0.12 + (project.priority === "High" ? 0.1 : 0))
        ).toFixed(2),
        projectLocation: project.location,
      }),
    });

    const sessionData = await checkoutSession.json();
    if (checkoutSession.ok) {
      // console.log("sessionDataaa:", sessionData);
      // Redirect to Stripe checkout
      window.location.href = sessionData.url;
    } else {
      console.error("Failed to create Stripe checkout session");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project, quote, markup }), // Send project and quote data to the server
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${project.title}_quote.pdf`);

        // Append to the document and trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "unset", md2: "3.7fr 1.44fr" },
        height: quote ? "100%" : "calc(100vh - 73px) !important",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "unset", sm2: "1.83fr 2.25fr" },
          gridTemplateRows: { xs: "unset", sm2: "75px" },
          // maxWidth: "1000px",
          gap: "24px",
          borderRight: 1,
          borderColor: "#32374033",
          paddingRight: { xs: 2, md2: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "space-between",
            paddingTop: "32px",
            gridColumn: "1/-1",
            flexWrap: "wrap",
          }}
        >
          <IconButton
            aria-label="back"
            sx={{
              width: "43px",
              height: "43px",
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
              borderRadius: "4px",
              padding: "0",
              backgroundColor: "#3237401A",
              "&:hover": {
                backgroundColor: "rgba(50, 55, 64, 0.2)",
              },
            }}
            onClick={() => {
              setSelectedProject(null);
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              onClick={() => router.push(`/project/${project._id}/edit`)}
              sx={{
                color: "#323740",
                backgroundColor: "rgba(50, 55, 64, 0.102)",
                "&:hover": {
                  backgroundColor: "rgba(50, 55, 64, 0.2)",
                },
              }}
            >
              Edit Project
            </Button>
            {quote && project.status === "Awaiting Payment" && (
              <Button
                variant="contained"
                onClick={handleCompleteOrder}
                sx={{
                  backgroundColor: "#60B143",
                  "&:hover": {
                    backgroundColor: "rgba(96, 177, 67, 0.9)",
                  },
                }}
              >
                Complete Order
              </Button>
            )}
            {(project.status === "Awaiting Payment" ||
              project.status === "In Progress") && (
              <Button
                variant="contained"
                onClick={() => letsGenerateQuote()}
                sx={{
                  backgroundColor: "#60B143",
                  "&:hover": {
                    backgroundColor: "rgba(96, 177, 67, 0.9)",
                  },
                }}
              >
                {project.status === "In Progress"
                  ? "Generate Quote"
                  : "Edit Quote"}
              </Button>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              xss: "1fr 1fr",
              xs4: "1fr 1fr 1fr",
            },
            gridTemplateRows: { xs: "unset", sm2: "266px 113px" },
            gap: "5px",
          }}
        >
          {project?.images &&
            project?.images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  display: "inline-block",
                  // width: index !== 0 &&"100px",
                  // height: index !== 0 &&"100px",
                  gridColumn: index === 0 && "1/-1",
                }}
              >
                <img
                  src={image}
                  alt={`preview-${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </Box>
            ))}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Box sx={{ marginBottom: "16px" }}>
            <Box
              sx={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 400,
                  fontSize: "24px",
                  textTransform: "uppercase",
                }}
              >
                {project.title}
              </Typography>
              <ProjectStatusChip status={project.status} />
            </Box>
            {project.startDate && (
              <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                <Chip
                  label={"Start Date: " + formatDate(project.startDate)}
                  sx={{
                    height: "unset",
                    backgroundColor: "#BB994133",
                    color: "#BB9941",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "500",
                    textTransform: "uppercase",
                    "& .MuiChip-label.MuiChip-labelMedium": {
                      padding: "4px 8px",
                    },
                  }}
                />
              </Box>
            )}
          </Box>
          <Divider />

          <Box>
            <Typography variant="detailsHeading">Location</Typography>
            <Typography variant="detailsText">{project.location}</Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="detailsHeading">Project Creator</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar src={project.user_id.image} />
              <Typography variant="detailsText">
                {project.user_id.username}
              </Typography>
            </Box>
          </Box>
          {/* <Divider />
        <Box>
          <Typography variant="detailsHeading">Description</Typography>
          <Typography variant="detailsText">{project.description}</Typography>
        </Box> */}
          <Divider />
          <Box>
            <Typography variant="detailsHeading">Notes</Typography>
            <Typography variant="detailsText">
              {project.description || "N/A"}
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="detailsHeading">Parts</Typography>
            {quote ? (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {quoteCategories.map(
                  (category) =>
                    category?.data &&
                    category?.data.length > 0 && (
                      <Box
                        key={category.name}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "start",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <Typography variant="detailsText" sx={{ mb: 0 }}>
                          {category.name}
                        </Typography>
                        {/* {category.data.map((item, index) => (
                        <Typography key={index} variant="detailsText">
                          {item?.material}
                          {item?.sku},{" "}
                          {item?.width &&
                            item?.width + "X" + item?.height + ","}{" "}
                          {item?.quantity} pcs
                        </Typography>
                      ))} */}
                        {category?.data.map((item, index) => (
                          <Typography
                            key={index}
                            variant="body1"
                            sx={{ mb: 0.5 }}
                          >
                            {item.quantity && `${item.quantity} pcs, `}
                            {item.material && `${item.material}, `}
                            {item.color && `${item.color}, `}
                            {item.sku.catalog &&
                              `Catalog: ${item.sku.catalog}, `}
                            {item.sku.skuCode && `SKU: ${item.sku.skuCode}, `}

                            {item.width &&
                              item.height &&
                              `${item.width}x${item.height} inches, `}
                            {category.name === "handles" &&
                              item.sku.productNumber &&
                              ` (${item.sku.productNumber})`}
                          </Typography>
                        ))}
                      </Box>
                    )
                )}
                <Divider />
                {/* Shipping cost */}
                <Box>
                  <Typography variant="detailsHeading">
                    Shipping Cost:
                  </Typography>
                  <Typography variant="detailsText">
                    ${Math.round(quote.price * 0.12).toFixed(2)}
                  </Typography>
                </Box>
                <Divider />
                {/* Priority cost */}
                <Box>
                  <Typography variant="detailsHeading">
                    Priority Cost:
                  </Typography>
                  <Typography variant="detailsText">
                    $
                    {project.priority === "High"
                      ? (quote.price * 0.1).toFixed(2)
                      : "0.00"}
                  </Typography>
                </Box>

                <Divider />
                <Box>
                  <Typography variant="detailsHeading">Quote</Typography>
                  <Typography variant="detailsText">
                    {quote?.price ? `$${quote.price}` : "N/A"}
                  </Typography>
                </Box>
                <Divider />
                {/* Total quote price including shipping and priority costs */}
                <Box
                  sx={{
                    mb: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <Box>
                    <Typography variant="detailsHeading">
                      Total Quote Price:
                    </Typography>
                    <Typography variant="detailsText">
                      $
                      {Math.round(
                        quote.price *
                          (1 + 0.12 + (project.priority === "High" ? 0.1 : 0))
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "end" }}>
                    <CustomInput
                      type="number"
                      value={markup}
                      handleChange={(e) => setMarkup(Number(e.target.value))}
                      label={"Enter markup"}
                      placeholder="Enter markup"
                      inputName="markup"
                      inputBoxSX={{ width: "unset" }}
                    />
                    <Button
                      type="submit"
                      variant="greenBtn"
                      color="primary"
                      onClick={handleDownloadPDF}
                    >
                      Export as PDF
                    </Button>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography variant="detailsText">
                No quote details available.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          paddingTop: "32px",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md2: "flex" },
            flexDirection: "column",
            position: "sticky",
            top: "24px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              paddingLeft: "16px",
              textTransform: "uppercase",
              // marginTop: "32px",
              marginBottom: "24px",
            }}
          >
            Messages
          </Typography>
          <MessageList messages={chat.messages} />
          <MessageInput onSend={handleSend} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectDetails;
