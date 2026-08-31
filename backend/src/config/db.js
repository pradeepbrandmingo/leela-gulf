import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

const connectDB = async () => {
  try {
    const baseUri = process.env.MONGODB_URI.endsWith("/")
      ? process.env.MONGODB_URI.slice(0, -1)
      : process.env.MONGODB_URI;

    const connectionInstance = await mongoose.connect(`${baseUri}/${DB_NAME}`);
    console.log(`MONGODB connected at ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
