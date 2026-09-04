import mongoose from "mongoose";

const visitorLogSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    sessionId: {
      type: String,
      index: true,
      trim: true,
    },
    ip: {
      type: String,
      trim: true,
      default: "127.0.0.1",
    },
    path: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    pageTitle: {
      type: String,
      trim: true,
      default: "Home Page",
    },
    referrer: {
      type: String,
      trim: true,
      default: "direct",
    },
    source: {
      type: String,
      enum: [
        "Organic Search",
        "Direct",
        "Social Media",
        "Referral",
        "Email",
        "Other",
      ],
      default: "Direct",
      index: true,
    },
    country: {
      type: String,
      default: "Unknown",
      index: true,
    },
    countryCode: {
      type: String,
      default: "XX",
      uppercase: true,
      trim: true,
      index: true,
    },
    city: {
      type: String,
      default: "Unknown",
    },
    device: {
      type: String,
      enum: ["Desktop", "Mobile", "Tablet", "Other"],
      default: "Desktop",
      index: true,
    },
    browser: {
      type: String,
      default: "Chrome",
    },
    os: {
      type: String,
      default: "Windows",
    },
    screenResolution: {
      type: String,
      default: "1920x1080",
    },
    isNewVisitor: {
      type: Boolean,
      default: false,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast date-range queries & aggregations
visitorLogSchema.index({ timestamp: -1, countryCode: 1 });
visitorLogSchema.index({ timestamp: -1, path: 1 });
visitorLogSchema.index({ timestamp: -1, source: 1 });
visitorLogSchema.index({ timestamp: -1, device: 1 });

// TTL index: Automatically expire and clean visitor logs after 365 days (1 year)
visitorLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

const VisitorLog = mongoose.model("VisitorLog", visitorLogSchema);

export default VisitorLog;
