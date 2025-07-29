import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("Please provide MONGODB_URI in .env file");
}

async function connectDB(params) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.log("MongoDb connection error ", error);
    process.exit(1);
  }
}

export default connectDB
