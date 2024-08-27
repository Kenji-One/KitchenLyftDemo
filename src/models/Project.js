import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  images: [{ type: String }],
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  priority: {
    type: String,
    enum: ["High", "Normal"],
    default: "Normal",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: [
      "Awaiting Payment",
      "Paid",
      "In Production",
      "Shipped",
      "Order Received",
      "Completed",
      "In Progress",
    ],
    default: "In Progress",
  },

  quotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
    },
  ],
  chat: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
});

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
