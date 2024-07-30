import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Link,
} from "@mui/material";

const ProjectCard = ({ project, onClick }) => {
  console.log(project);
  return (
    <Card
      sx={{
        position: "relative",
        boxShadow: "none",
        padding: "7px",
        cursor: "pointer",

        "&:hover": {
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        },
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height="auto"
        image={project.image || "/images/kitchen1.jpg"}
        alt={project.title}
      />
      <CardContent sx={{ padding: 0, paddingTop: "12px" }}>
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 800 }}>
            {project.title}
          </Typography>
          <Chip
            label={project.overallStatus.status}
            sx={{
              height: "unset",
              backgroundColor: project.overallStatus.bgColor,
              color: project.overallStatus.textColor,
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
          <Chip
            label={project.franchiseStatus.status}
            sx={{
              height: "unset",
              backgroundColor: project.franchiseStatus.bgColor,
              color: project.franchiseStatus.textColor,
              fontSize: "12px",
              fontWeight: "500",
              textTransform: "uppercase",
              borderRadius: "4px",
              "& .MuiChip-label.MuiChip-labelMedium": {
                padding: "4px 8px",
              },
            }}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {project.description}
          </Typography>
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
              <Typography variant="caption">DL: {project.dueDate}</Typography>
            </Chip>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            mt: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            <strong>Author:</strong> {project.user_id.username}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            <strong>Location:</strong> {project.location}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
