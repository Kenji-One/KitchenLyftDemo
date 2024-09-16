import React from "react";
import { Box } from "@mui/material";
import PdfViewer from "@/utils/PdfViewer";
const Catalogue = () => {
  return (
    <Box>
      <PdfViewer fileUrl="/pdfs/KL Catalogue.pdf" />
    </Box>
  );
};

export default Catalogue;
