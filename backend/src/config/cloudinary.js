import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "d3jasswz",
  api_key: process.env.CLOUDINARY_API_KEY || "176892299212594",
  api_secret: process.env.CLOUDINARY_API_SECRET || "pvGUWmr3V-5984Ff0hJL2SepzJg",
  secure: true,
});

export default cloudinary;
