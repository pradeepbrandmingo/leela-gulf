import mongoose from "mongoose";

/**
 * EmailVerificationCache Schema
 * Caches email verification results for 24 hours to prevent Google/Yahoo SMTP rate-limiting.
 * Uses native MongoDB TTL Index (auto-expires documents after 24 hours / 86400 seconds).
 */
const emailVerificationCacheSchema = new mongoose.Schema(
  {
    normalizedEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    isSpam: {
      type: Boolean,
      default: false,
    },
    emailStatus: {
      type: String,
      required: true,
    },
    emailQuality: {
      type: String,
      default: "PERSONAL_EMAIL",
    },
    emailReason: {
      type: String,
      default: "",
    },
    score: {
      type: Number,
      default: 80,
    },
  },
  {
    timestamps: true,
  },
);

// MongoDB Native TTL Index: Automatically expires and deletes cached results after 24 hours (86400 seconds)
emailVerificationCacheSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 86400 },
);

const EmailVerificationCache =
  mongoose.models.EmailVerificationCache ||
  mongoose.model("EmailVerificationCache", emailVerificationCacheSchema);

export default EmailVerificationCache;
