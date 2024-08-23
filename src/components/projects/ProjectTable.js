import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
} from "@mui/material";
import ProjectStatusChip from "./ProjectStatusChip";

const ProjectTable = ({ projects, onProjectClick }) => {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
      <Table
        aria-label="projects table"
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
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Creator</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Quote</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project._id}
              hover
              onClick={() => onProjectClick(project._id)}
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
                  alt={project.title}
                  src={project.images[0] || "/default-project-image.jpg"}
                  sx={{
                    marginRight: "12px",
                    width: "100px",
                    height: "60px",
                    borderRadius: "4px",
                  }}
                />
                {project.title}
              </TableCell>
              <TableCell>
                <ProjectStatusChip status={project.status} />
              </TableCell>
              <TableCell>{project.user_id.username}</TableCell>
              <TableCell>{project.location}</TableCell>
              <TableCell>
                {project.quote ? `$${project.quote}` : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectTable;
