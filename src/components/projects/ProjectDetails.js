"use client";

import React from "react";
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
import Image from "next/image";

const ProjectDetails = ({
  project,
  quote,
  chat,
  setSelectedProject,
  handleChange,
}) => {
  const quoteCategories = [
    { name: "Doors", data: quote?.doors },
    { name: "Drawer Fronts", data: quote?.drawerFronts },
    { name: "Side Panels", data: quote?.sidePanels },
    { name: "Kick Plates", data: quote?.kickPlates },
    { name: "Handles", data: quote?.handles },
    { name: "Extras", data: quote?.extras },
  ];
  const handleSend = async (text) => {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId: chat.projectId, text }),
    });

    if (response.ok) {
      const data = await response.json();
      // setSelectedChat(data);

      // // Update the corresponding chat in the chats array
      // setChats((prevChats) =>
      //   prevChats.map((chat) =>
      //     chat._id === data._id ? { ...chat, messages: data.messages } : chat
      //   )
      // );
    }
  };
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "3.7fr 1.44fr",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1.83fr 2.25fr",
          gridTemplateRows: "75px",
          // maxWidth: "1000px",
          gap: "24px",
          borderRight: 1,
          borderColor: "#32374033",
          paddingRight: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            gridColumn: "1/-1",
            justifyContent: "space-between",
            paddingTop: "32px",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Button
              variant="contained"
              onClick={() => router.push(`/projects/${project._id}/edit`)}
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
            <Button
              variant="contained"
              onClick={() => handleChange(null, 4)}
              sx={{
                backgroundColor: "#60B143",
                "&:hover": {
                  backgroundColor: "rgba(96, 177, 67, 0.9)",
                },
              }}
            >
              Generate Quote
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "266px 113px",
            gap: "5px",
            // mt: "12px",
          }}
        >
          {/* <Image
            src={project.image || "/default-project-image.jpg"}
            alt={project.title}
            width={200}
            height={150}
            style={{
              borderRadius: "4px",
              width: "100%",
              height: "100%",
              gridColumn: "1/-1",
              objectFit: "cover",
            }}
          /> */}
          <img
            src={project.image || "/default-project-image.jpg"}
            alt={`preview-image`}
            style={{
              width: "100%",
              height: "100%",
              gridColumn: "1/-1",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />

          {project?.additionalImages &&
            project?.additionalImages.map((image, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  display: "inline-block",
                  // width: index !== 0 &&"100px",
                  // height: index !== 0 &&"100px",
                  // gridColumn: index === 0 && "1/-1",
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
              <Chip
                label={project.status}
                sx={{
                  height: "unset",
                  backgroundColor:
                    project.status === "In Progress" ||
                    project.status === "In Review"
                      ? "#BB994133"
                      : project.status === "Finished"
                      ? "#7C9A4733"
                      : "#BB484133",
                  color:
                    project.status === "In Progress" ||
                    project.status === "In Review"
                      ? "#BB9941"
                      : project.status === "Finished"
                      ? "#7C9A47"
                      : "#BB4841",
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
            <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
              {project.dueDate && (
                <Chip
                  label={"DL: " + project.dueDate}
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
                >
                  <Typography variant="caption">
                    DL: {project.dueDate}
                  </Typography>
                </Chip>
              )}
            </Box>
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
                    category.data.length > 0 && (
                      <Box
                        key={category.name}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="detailsText" sx={{ mb: 0 }}>
                          {category.name}
                        </Typography>
                        {category.data.map((item, index) => (
                          <Typography key={index} variant="detailsText">
                            {item.material}, {item.size}, {item.quantity} pcs
                          </Typography>
                        ))}
                      </Box>
                    )
                )}
              </Box>
            ) : (
              <Typography variant="detailsText">N/A</Typography>
            )}
          </Box>
          <Divider />
          <Box>
            <Typography variant="detailsHeading">Quote</Typography>
            <Typography variant="detailsText">
              {quote?.price ? `$${quote.price}` : "N/A"}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingTop: "32px",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              paddingLeft: "16px",
              textTransform: "uppercase",
              // marginTop: "32px",
              marginBottom: "4px",
            }}
          >
            Messages
          </Typography>
          <MessageList messages={chat.messages} />
        </Box>
        <MessageInput onSend={handleSend} />
      </Box>
    </Box>
  );
};

export default ProjectDetails;
