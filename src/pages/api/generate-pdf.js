import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import SVGtoPDF from "svg-to-pdfkit";
export default async function handler(req, res) {
  const { project, quote, markup } = req.body;

  // Create a new PDF document
  const doc = new PDFDocument({ margin: 50 });
  doc.registerFont("Heading Font", "public/fonts/PaytoneOne-Regular.ttf");
  doc.registerFont("Headlines Font", "public/fonts/Lato-Bold.ttf");
  doc.registerFont("Text Font", "public/fonts/Lato-Regular.ttf");
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
  const logoPath = path.join(process.cwd(), "public", "logo 1.svg");
  const svgData = fs.readFileSync(logoPath, "utf8");

  // Add the SVG logo to the PDF
  const logoWidth = 150; // Desired width for the logo
  const centerX = (doc.page.width - logoWidth) / 2; // Calculate center position
  SVGtoPDF(doc, svgData, centerX, 40, { width: logoWidth });

  // doc.image(logoPath, centerX, 40, {
  //   // Center the image
  //   fit: [logoWidth, logoHeight],
  //   align: "center",
  //   valign: "top",
  // });

  doc.moveDown(4);
  doc
    .font("Heading Font")
    .fontSize(28)
    .text("Quotation", { align: "center", lineGap: 10 });
  doc.moveDown(0.5);

  doc.fontSize(12);
  doc
    .font("Headlines Font")
    .text("Client:", { continued: true })
    .font("Text Font")
    .text(`  ${project.customerName || "N/A"}`);
  doc.moveDown(0.2);
  doc
    .font("Headlines Font")
    .text("Address:", { continued: true })
    .font("Text Font")
    .text(`  ${project.customerAddress || "N/A"}`);
  doc.moveDown(0.2);
  doc
    .font("Headlines Font")
    .text("Contact Info:", { continued: true })
    .font("Text Font")
    .text(`  ${project.customerPhoneNumber || "N/A"}`);
  doc.moveDown(0.2);
  doc
    .font("Headlines Font")
    .text("Date:", { continued: true })
    .font("Text Font")
    .text(`  ${new Date().toLocaleDateString()}`);
  doc.moveDown(2);
  // Add a table header for items

  doc
    .font("Headlines Font")
    .fontSize(14)
    .text("Item", { align: "left", underline: true, continued: true });
  doc
    .font("Headlines Font")
    .text("Description", { align: "right", underline: true });
  doc.moveDown(0.5);

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
    category.items.forEach((item, index) => {
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
        .font("Headlines Font")
        .fontSize(12)
        .text(category.name, { continued: true })
        .font("Text Font")
        .text(itemDescription, { align: "right" });
      // Add minimal spacing after each line
      doc.moveDown(0.2); // Smaller spacing between items
    });
  });

  // Add quote and total price
  const totalPrice = Math.round(
    quote?.price * (1 + 0.12 + (project?.priority === "High" ? 0.1 : 0)) +
      markup
  ).toFixed(2);
  doc.moveDown(2);
  doc
    .font("Headlines Font")
    .fontSize(12)
    .text("QUOTE PRICE:", { continued: true })
    .font("Text Font")
    .text(`$${quote?.price || 0}`, { align: "right" });
  doc.moveDown(0.3);

  const taxes = totalPrice - quote?.price;
  doc
    .font("Headlines Font")
    .text("*PLUS APPLICABLE TAXES*", { continued: true })
    .font("Text Font")
    .text(`$${taxes}`, { align: "right" });
  doc.moveDown(0.3);

  doc
    .font("Headlines Font")
    .text("TOTAL PRICE:", { continued: true })
    .font("Text Font")
    .text(`$${totalPrice}`, { align: "right" });
  doc.moveDown(2);

  // Add note section
  doc.moveDown();
  doc.font("Headlines Font").text("Note:", { underline: true });
  doc.moveDown(0.2);

  doc.font("Text Font").text(project.description);

  // Finalize the PDF and end the stream
  doc.end();
}
