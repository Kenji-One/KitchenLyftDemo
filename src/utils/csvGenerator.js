import { Parser } from "json2csv";

export const generateCSV = (project, quote) => {
  // Extract all item categories from the quote
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

  // Prepare the CSV data
  const csvData = [];

  // Add header rows
  csvData.push({
    Client: project.customerName || "N/A",
    Address: project.customerAddress || "N/A",
    ContactInfo: project.customerPhoneNumber || "N/A",
    Date: new Date().toLocaleDateString(),
    Item: "",
    Description: "",
  });

  // Add blank row for spacing
  csvData.push({
    Client: "",
    Address: "",
    ContactInfo: "",
    Date: "",
    Item: "Item",
    Description: "Description",
  });

  // Add each item to the CSV data
  categories.forEach((category) => {
    category.items.forEach((item) => {
      const itemDescription = `${item.quantity || ""} ${item.material || ""} ${
        item.color || ""
      }, ${item.width || ""}x${item.height || ""} inches${
        item.sku?.skuCode ? `, SKU: ${item.sku.skuCode}` : ""
      }`;
      csvData.push({
        Client: "",
        Address: "",
        ContactInfo: "",
        Date: "",
        Item: category.name,
        Description: itemDescription,
      });
    });
  });

  // Add quote price row
  csvData.push({
    Client: "",
    Address: "",
    ContactInfo: "",
    Date: "",
    Item: "",
    Description: "",
  });

  csvData.push({
    Client: "",
    Address: "",
    ContactInfo: "",
    Date: "",
    Item: "QUOTE PRICE:",
    Description: `$${quote?.price || 0}`,
  });

  // Add total price row
  csvData.push({
    Client: "",
    Address: "",
    ContactInfo: "",
    Date: "",
    Item: "*PLUS APPLICABLE TAXES*",
    Description: `$${
      project.priority === "High" ? (quote.price * 0.1).toFixed(2) : "0.00"
    }`,
  });

  // csvData.push({
  //   Client: "",
  //   Address: "",
  //   ContactInfo: "",
  //   Date: "",
  //   Item: "TOTAL PRICE:",
  //   Description: `$${Math.round(
  //     quote?.price * (1 + 0.12 + (project?.priority === "High" ? 0.1 : 0))
  //   ).toFixed(2)}`,
  // });

  // Add note section
  csvData.push({
    Client: "",
    Address: "",
    ContactInfo: "",
    Date: "",
    Item: "Note:",
    Description: project.description,
  });

  // Convert to CSV format
  const json2csvParser = new Parser({
    fields: ["Client", "Address", "ContactInfo", "Date", "Item", "Description"],
  });
  const csv = json2csvParser.parse(csvData);

  return csv;
};
