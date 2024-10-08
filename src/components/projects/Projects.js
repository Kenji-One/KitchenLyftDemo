import { Box, Typography } from "@mui/material";
import ProjectTable from "./ProjectTable";

const Projects = ({
  projects,
  onProjectClick,
  userRole,
  handleDeleteProject,
}) => {
  return (
    <Box sx={{ mt: "16px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h2">Projects</Typography>
      </Box>
      {projects.length > 0 ? (
        <ProjectTable
          projects={projects}
          onProjectClick={onProjectClick}
          userRole={userRole}
          onProjectDelete={handleDeleteProject}
        />
      ) : (
        <Typography sx={{ pt: 2 }}>No projects available</Typography>
      )}
    </Box>
  );
};

export default Projects;
