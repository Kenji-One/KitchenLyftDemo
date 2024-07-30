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
                  src={project.image || "/default-project-image.jpg"}
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
