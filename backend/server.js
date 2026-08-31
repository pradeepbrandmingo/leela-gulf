import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { ensureAdminExists } from "./src/scripts/seedAdmin.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

connectDB()
  .then(async () => {
    // Auto seed single admin if database is new/empty
    await ensureAdminExists();

    app.listen(PORT, () => {
      console.log(`🚀 Leela Gulf API Server is running at port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  });
