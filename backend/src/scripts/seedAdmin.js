import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";
import connectDB from "../config/db.js";

dotenv.config();

/**
 * Production Ready Single Admin Initializer / Seeder
 */
export const DEFAULT_ADMIN_CONFIG = {
  name: "Leela Gulf Admin",
  email: "admin@leelagulf.com",
  password: "Admin@LeelaGulf2026#",
  role: "admin",
};

export const ensureAdminExists = async () => {
  try {
    const existingAdmin = await Admin.findOne({ role: "admin" });

    if (!existingAdmin) {
      await Admin.create(DEFAULT_ADMIN_CONFIG);
      console.log(`✅ [ADMIN SEEDER] Single Admin initialized successfully.`);
      console.log(`📧 Email: ${DEFAULT_ADMIN_CONFIG.email}`);
    } else {
      console.log(`🔒 [ADMIN SEEDER] Single Admin account verified in MongoDB (${existingAdmin.email}).`);
    }
  } catch (error) {
    console.error("⚠️ [ADMIN SEEDER ERROR]:", error.message);
  }
};

// Standalone runner when invoked directly via CLI (npm run seed:admin)
const runStandaloneSeed = async () => {
  try {
    await connectDB();
    await ensureAdminExists();
    process.exit(0);
  } catch (err) {
    console.error("Standalone Seeder Failed:", err);
    process.exit(1);
  }
};

if (process.argv[1] && process.argv[1].endsWith("seedAdmin.js")) {
  runStandaloneSeed();
}
