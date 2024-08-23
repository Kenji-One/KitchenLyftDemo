import React from "react";
import { Chip } from "@mui/material";

const ProjectStatusChip = ({ status }) => {
  return (
    <Chip
      label={status}
      sx={{
        height: "unset",
        backgroundColor:
          status === "In Progress" ||
          status === "Awaiting Payment" ||
          status === "In Production" ||
          status === "Order Received"
            ? "#BB994133"
            : status === "Finished" ||
              status === "Paid" ||
              status === "Shipped" ||
              status === "Completed"
            ? "#7C9A4733"
            : "#BB484133",
        color:
          status === "In Progress" ||
          status === "Awaiting Payment" ||
          status === "In Production" ||
          status === "Order Received"
            ? "#BB9941"
            : status === "Finished" ||
              status === "Paid" ||
              status === "Shipped" ||
              status === "Completed"
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
  );
};

export default ProjectStatusChip;
