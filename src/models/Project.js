import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  additionalImages: [{ type: String }],
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
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    default: "In Review",
  },
  overallStatus: {
    status: {
      type: String,
      default: "Active",
    },
    bgColor: {
      type: String,
      default: "#7C9A4733",
    },
    textColor: {
      type: String,
      default: "#7C9A47",
    },
  },
  franchiseStatus: {
    status: {
      type: String,
      default: "In Review",
    },
    bgColor: {
      type: String,
      default: "#BB994133",
    },
    textColor: {
      type: String,
      default: "#BB9941",
    },
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
