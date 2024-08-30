// models/Chat.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      // required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
