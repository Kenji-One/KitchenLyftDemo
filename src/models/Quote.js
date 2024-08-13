import mongoose from "mongoose";

const itemSchema = {
  material: String,
  width: String,
  height: String,
  quantity: Number,
};

const handleSchema = {
  sku: String,
  quantity: Number,
};

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
      type: itemSchema,
      _id: false,
    },
  ],
  drawerFronts: [
    {
      type: itemSchema,
      _id: false,
    },
  ],
  sidePanels: [
    {
      type: itemSchema,
      _id: false,
    },
  ],
  kickPlates: [
    {
      type: itemSchema,
      _id: false,
    },
  ],
  trim: [
    {
      type: itemSchema,
      _id: false,
    },
  ],
  handles: [
    {
      type: handleSchema,
      _id: false,
    },
  ],
  hinges: [
    {
      type: handleSchema,
      _id: false,
    },
  ],
  extras: [
    {
      type: handleSchema,
      _id: false,
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
