import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // firstName: { type: String, required: true },
    // lastName: { type: String, required: true },
    image: { type: String },
    role: {
      type: String,
      enum: [
        "CorporateAdmin",
        "CorporateUser",
        "FranchiseAdmin",
        "FranchiseUser",
      ],
      required: true,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
