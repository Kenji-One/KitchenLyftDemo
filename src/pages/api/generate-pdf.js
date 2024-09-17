import PDFDocument from "pdfkit";
import path from "path";

export default async function handler(req, res) {
  const { project, quote } = req.body;

  // Create a new PDF document
  const doc = new PDFDocument();
  let buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    let pdfData = Buffer.concat(buffers);
    res
      .writeHead(200, {
        "Content-Length": Buffer.byteLength(pdfData),
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${project.title}_quote.pdf`,
      })
      .end(pdfData);
  });

  // Correctly resolve the path to the logo image
  const logoPath = path.join(process.cwd(), "public", "logo 1.jpg");

  // Add the logo image to the top and center it
  const logoWidth = 150;
  const pageWidth = doc.page.width;
  const centerX = (pageWidth - logoWidth) / 2; // Calculate center position

  doc.image(logoPath, centerX, 50, {
    // Center the image
    fit: [logoWidth, 50],
  });

  // Add spacing after the logo
  doc.moveDown(2); // Adjust the value for more space

  doc.fontSize(12).text(`Client: ${project.customerName || "N/A"}`);
  doc.text(`Address: ${project.customerAddress || "N/A"}`);
  doc.text(`Contact Info: ${project.customerPhoneNumber || "N/A"}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  // Add a table header for items
  doc.moveDown();
  doc
    .fontSize(14)
    .text("Item", { continued: true })
    .text("Description", { align: "right" });

  // Extract all item categories from the quote and add them to the document
  const categories = [
    { name: "Doors", items: quote?.doors || [] },
    { name: "Drawer Fronts", items: quote?.drawerFronts || [] },
    { name: "Side Panels", items: quote?.sidePanels || [] },
    { name: "Kick Plates", items: quote?.kickPlates || [] },
    { name: "Trim", items: quote?.trim || [] },
    { name: "Finishing Touch", items: quote?.finishingTouch || [] },
    { name: "Handles", items: quote?.handles || [] },
    { name: "Hinges", items: quote?.hinges || [] },
  ];

  categories.forEach((category) => {
    category.items.forEach((item) => {
      const itemDescription = `${item.quantity || ""} ${item.material || ""} ${
        item.color ? item.color + "," : ""
      } ${
        item.width && item.height
          ? item.width + "x" + item.height + " inches,"
          : ""
      } ${
        item.sku?.skuCode || item?.sku
          ? ` SKU: ${item.sku?.skuCode || item?.sku}`
          : ""
      }`;
      doc
        .fontSize(12)
        .text(category.name, { continued: true })
        .text(itemDescription, { align: "right" });
    });
  });

  // Add quote and total price
  const totalPrice = Math.round(
    quote?.price * (1 + 0.12 + (project?.priority === "High" ? 0.1 : 0))
  ).toFixed(2);
  doc.moveDown();
  doc
    .fontSize(12)
    .text("QUOTE PRICE:", { continued: true })
    .text(`$${quote?.price || 0}`, { align: "right" });
  const taxes = totalPrice - quote?.price;
  doc
    .text("*PLUS APPLICABLE TAXES*", { continued: true })
    .text(`$${taxes}`, { align: "right" });

  // doc
  //   .text("TOTAL PRICE:", { continued: true })
  //   .text(totalPrice, { align: "right" });

  // Add note section
  doc.moveDown();
  doc.text("Note:", { underline: true });
  doc.text(project.description);

  // Finalize the PDF and end the stream
  doc.end();
}
