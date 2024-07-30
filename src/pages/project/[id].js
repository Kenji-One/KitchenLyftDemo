"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography, Avatar, Chip, Button } from "@mui/material";
import Loader from "@/utils/Loader";
import Image from "next/image";

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchProjectDetails = async () => {
        setLoading(true);
        const response = await fetch(`/api/projects/${id}`);
        const data = await response.json();
        setProject(data.project);
        setQuote(data.quote);
        setLoading(false);
      };

      fetchProjectDetails();
    }
  }, [id]);

  if (!project) return <Typography>Project not found</Typography>;

  return (
    <>
      <Loader open={loading} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Image
            src={project.image || "/default-project-image.jpg"}
            alt={project.title}
            width={200}
            height={150}
            style={{ borderRadius: "8px" }}
          />
          <Box>
            <Typography variant="h4">{project.title}</Typography>
            <Chip label={project.overallStatus.status} />
            <Chip label={project.franchiseStatus.status} />
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box>
            <Typography variant="h6">Location</Typography>
            <Typography>{project.location}</Typography>
          </Box>
          <Box>
            <Typography variant="h6">Project Creator</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar src={project.user_id.image} />
              <Typography>{project.user_id.username}</Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Typography variant="h6">Description</Typography>
          <Typography>{project.description}</Typography>
        </Box>
        <Box>
          <Typography variant="h6">Notes</Typography>
          <Typography>{project.notes || "N/A"}</Typography>
        </Box>
        <Box>
          <Typography variant="h6">Parts</Typography>
          {quote ? (
            <>
              {quote.doors.length > 0 && (
                <Box>
                  <Typography variant="subtitle1">Doors</Typography>
                  {quote.doors.map((door, index) => (
                    <Typography key={index}>
                      {door.material}, {door.size}, {door.quantity} pcs
                    </Typography>
                  ))}
                </Box>
              )}
              {quote.drawerFronts.length > 0 && (
                <Box>
                  <Typography variant="subtitle1">Drawer Fronts</Typography>
                  {quote.drawerFronts.map((drawerFront, index) => (
                    <Typography key={index}>
                      {drawerFront.material}, {drawerFront.size},{" "}
                      {drawerFront.quantity} pcs
                    </Typography>
                  ))}
                </Box>
              )}
              {quote.sidePanels.length > 0 && (
                <Box>
                  <Typography variant="subtitle1">Side Panels</Typography>
                  {quote.sidePanels.map((sidePanel, index) => (
                    <Typography key={index}>
                      {sidePanel.material}, {sidePanel.size},{" "}
                      {sidePanel.quantity} pcs
                    </Typography>
                  ))}
                </Box>
              )}
              {quote.kickPlates.length > 0 && (
                <Box>
                  <Typography variant="subtitle1">Kick Plates</Typography>
                  {quote.kickPlates.map((kickPlate, index) => (
                    <Typography key={index}>
                      {kickPlate.material}, {kickPlate.size},{" "}
                      {kickPlate.quantity} pcs
                    </Typography>
                  ))}
                </Box>
              )}
              {quote.handles.length > 0 && (
                <Box>
                  <Typography variant="subtitle1">Handles</Typography>
                  {quote.handles.map((handle, index) => (
                    <Typography key={index}>
                      {handle.material}, {handle.size}, {handle.quantity} pcs
                    </Typography>
                  ))}
                </Box>
              )}
              {quote.extras.length > 0 && (
                <Box>
                  <Typography variant="subtitle1">Extras</Typography>
                  {quote.extras.map((extra, index) => (
                    <Typography key={index}>
                      {extra.material}, {extra.size}, {extra.quantity} pcs
                    </Typography>
                  ))}
                </Box>
              )}
            </>
          ) : (
            <Typography>N/A</Typography>
          )}
        </Box>
        <Button
          variant="contained"
          onClick={() => router.push(`/projects/${project._id}/edit`)}
        >
          Edit Project
        </Button>
        <Button
          variant="contained"
          onClick={() => router.push(`/projects/${project._id}/quote`)}
        >
          Generate Quote
        </Button>
      </Box>
    </>
  );
};

export default ProjectDetails;
