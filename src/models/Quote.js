import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  projectTemplate: String,
  price: String,
  doors: [
    {
      material: String,
      size: String,
      quantity: Number,
    },
  ],
  drawerFronts: [
    {
      material: String,
      size: String,
      quantity: Number,
    },
  ],
  sidePanels: [
    {
      material: String,
      size: String,
      quantity: Number,
    },
  ],
  kickPlates: [
    {
      material: String,
      size: String,
      quantity: Number,
    },
  ],
  handles: [
    {
      material: String,
      size: String,
      quantity: Number,
    },
  ],
  extras: [
    {
      material: String,
      size: String,
      quantity: Number,
    },
  ],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Quote || mongoose.model("Quote", quoteSchema);
