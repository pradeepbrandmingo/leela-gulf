import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const GOOGLE_SHEET_WEBHOOK_URL =
  process.env.GOOGLE_SHEET_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbyepOp2Jx45rkJreesfHCjVqVHatfRCDJiNhfBROVBwuEy4JuQz7-yb11Gzj6qLcTws/exec";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://leelagaurivala_db_user:zoA0sGXZ7TRhc4vf@cluster0.ww8q2ig.mongodb.net/";

const leadSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    service: String,
    country: String,
    phone: String,
    message: String,
    sourcePage: String,
    productName: String,
    productSlug: String,
    productUrl: String,
    createdAt: Date,
  },
  { timestamps: true }
);

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

async function syncAllLeads() {
  try {
    console.log("Connecting to MongoDB Database (leela-gulf)...");
    const baseUri = MONGODB_URI.endsWith("/") ? MONGODB_URI.slice(0, -1) : MONGODB_URI;
    await mongoose.connect(`${baseUri}/leela-gulf`);
    console.log("MongoDB Connected Successfully!");

    const leads = await Lead.find({}).sort({ createdAt: 1 });
    console.log(`Found ${leads.length} total leads in database. Syncing to Google Sheet...`);

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      const payload = {
        firstName: lead.firstName || "",
        lastName: lead.lastName || "",
        email: lead.email || "",
        phone: lead.phone || "",
        country: lead.country || "",
        service: lead.service || lead.productName || "General Inquiry",
        message: lead.message || "",
        sourcePage: lead.sourcePage || "Contact Page",
        productUrl: lead.productUrl || "",
      };

      console.log(`Syncing lead [${i + 1}/${leads.length}]: ${payload.firstName} ${payload.lastName} (${payload.email})`);

      await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Small delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    console.log("ALL LEADS SUCCESSFULLY SYNCED TO GOOGLE SHEET!");
    process.exit(0);
  } catch (error) {
    console.error("Error syncing leads:", error);
    process.exit(1);
  }
}

syncAllLeads();
