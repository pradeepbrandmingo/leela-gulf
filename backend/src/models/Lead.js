import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
      maxlength: [50, "First Name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
      maxlength: [50, "Last Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email Address is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        "Please provide a valid email address",
      ],
    },
    service: {
      type: String,
      default: "General Inquiry",
      trim: true,
    },
    country: {
      type: String,
      default: "United States",
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    sourcePage: {
      type: String,
      default: "Contact Page",
      trim: true,
    },
    productName: {
      type: String,
      trim: true,
    },
    productSlug: {
      type: String,
      trim: true,
    },
    productUrl: {
      type: String,
      trim: true,
    },
    agreedToTerms: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["New", "In Progress", "Contacted", "Closed"],
      default: "New",
    },
    // Automatic Email Verification & Health Indicator fields for Admin
    emailStatus: {
      type: String,
      enum: ["deliverable", "undeliverable", "unknown", "READY", "SPAM"],
      default: "deliverable",
    },
    emailReason: {
      type: String,
      default: "",
    },
    emailQuality: {
      type: String,
      default: "PERSONAL_EMAIL",
    },
    emailScore: {
      type: Number,
      default: 80,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for fast search in Admin Dashboard
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ emailStatus: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

export default Lead;
