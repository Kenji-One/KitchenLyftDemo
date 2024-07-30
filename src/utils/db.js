import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return mongoose.connection.db;
  }
  await mongoose.connect(process.env.MONGO_URI);
  return mongoose.connection.db;
};

export default connectDB;
