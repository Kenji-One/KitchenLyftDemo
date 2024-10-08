import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    userId: {
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
        "Completed",
      ],
      default: "Awaiting Payment",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    firstPayment: {
      amount: Number,
      status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending",
      },
      paymentIntentId: String,
      paymentMethodId: String,
    },
    secondPayment: {
      amount: Number,
      status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending",
      },
      paymentIntentId: String,
    },
    stripeCustomerId: { type: String }, // Add this line
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
