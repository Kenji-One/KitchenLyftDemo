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

import ProjectStatusChip from "./ProjectStatusChip";

const ProjectCard = ({ project, onClick, key }) => {
  return (
    <Card
      key={key}
      sx={{
        position: "relative",
        boxShadow: "none",
        padding: "0",
        cursor: "pointer",
        maxWidth: { xs: "100%", xs2: "224px" },
        marginRight: "16px",
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height="auto"
        image={project.images[0] || "/images/kitchen1.jpg"}
        alt={project.title}
        sx={{
          height: { xs: "auto", xs2: "138px" },
          maxWidth: { xs: "100%", xs2: "224px" },
          borderRadius: "4px",
        }}
      />

      <CardContent
        sx={{ padding: 0, paddingTop: "10px", paddingBottom: "12 !important" }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            rowGap: "4px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 800 }}>
            {project.title}
          </Typography>
          <ProjectStatusChip status={project.status} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
