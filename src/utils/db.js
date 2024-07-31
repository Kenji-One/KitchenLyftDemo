import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable inside .env.local"
  );
}

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return mongoose.connection.db;
  }

  try {
    console.log("Connecting to Mongo!");
    await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected`);
    return mongoose.connection.db;
  } catch (err) {
    console.error("Cannot connect to the database!", err);
    // process.exit(1);
  }
};

export default connectDB;
