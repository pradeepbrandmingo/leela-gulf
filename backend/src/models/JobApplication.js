import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },
    currentLocation: {
      type: String,
      trim: true,
      default: "Dubai, UAE",
    },
    residentialAddress: {
      type: String,
      trim: true,
      default: "",
    },
    education: {
      type: String,
      required: [true, "Highest education level is required"],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization / Discipline is required"],
      trim: true,
    },
    totalExperience: {
      type: String,
      required: [true, "Total experience is required"],
      trim: true,
    },
    postAppliedFor: {
      type: String,
      required: [true, "Target position applied for is required"],
      trim: true,
      index: true,
    },
    referralSource: {
      type: String,
      trim: true,
      default: "Company Website",
    },
    resumeUrl: {
      type: String,
      required: [true, "Resume CV document is required"],
      trim: true,
    },
    resumeName: {
      type: String,
      trim: true,
      default: "Resume.pdf",
    },
    coverNote: {
      type: String,
      trim: true,
      default: "",
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying
jobApplicationSchema.index({ createdAt: -1, postAppliedFor: 1 });
jobApplicationSchema.index({ email: 1, phone: 1 });

const JobApplication =
  mongoose.models.JobApplication || mongoose.model("JobApplication", jobApplicationSchema);

export default JobApplication;
