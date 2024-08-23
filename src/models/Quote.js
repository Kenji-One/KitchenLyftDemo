import mongoose from "mongoose";

const itemSKUSchema = {
  name: String,
  skuCode: String,
  catalog: String,
};

const itemSchema = {
  material: String,
  width: String,
  height: String,
  color: String,
  quantity: Number,
  sku: { type: itemSKUSchema },
};

const handleSchema = {
  sku: { type: itemSKUSchema },
  quantity: Number,
};
const hingeSchema = {
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
  finishingTouch: [
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
      type: hingeSchema,
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
