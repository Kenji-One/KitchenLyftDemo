import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Button } from "@mui/material";
// import { useRouter } from "next/router";
import ProjectCard from "./ProjectCard";
import ProjectTable from "./ProjectTable";

const Projects = ({ projects, onProjectClick }) => {
  // const router = useRouter();

  // const handleCreateProject = () => {
  //   router.push("/create-project");
  // };
  // console.log(projects);
  return (
    <Box sx={{ mt: "16px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h2">Projects</Typography>
      </Box>
      {projects.length > 0 ? (
        // projects.map((project) => (
        //   <Grid
        //     item
        //     key={project._id}
        //     xs={12}
        //     sm={6}
        //     md={4}
        //     lg={3}
        //     sx={{ maxWidth: "285px !important" }}
        //   >
        //     <ProjectCard
        //       project={project}
        //       onClick={() => onProjectClick(project._id)}
        //     />
        //   </Grid>
        // ))
        <ProjectTable projects={projects} onProjectClick={onProjectClick} />
      ) : (
        <Typography sx={{ pt: 2 }}>No projects available</Typography>
      )}
    </Box>
  );
};

export default Projects;
