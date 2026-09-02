import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required in English"],
      trim: true,
    },
    titleAr: {
      type: String,
      trim: true,
      default: "",
    },
    department: {
      type: String,
      required: [true, "Department/Category is required"],
      trim: true,
      index: true,
    },
    departmentAr: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "Dubai, UAE",
    },
    locationAr: {
      type: String,
      trim: true,
      default: "دبي، الإمارات",
    },
    jobType: {
      type: String,
      trim: true,
      default: "Full-Time",
    },
    jobTypeAr: {
      type: String,
      trim: true,
      default: "دوام كامل",
    },
    overview: {
      type: String,
      required: [true, "Job overview summary is required in English"],
      trim: true,
    },
    overviewAr: {
      type: String,
      trim: true,
      default: "",
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    responsibilitiesAr: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    requirementsAr: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
      index: true,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast search & filtering
jobSchema.index({ status: 1, department: 1, createdAt: -1 });
jobSchema.index({ title: "text", department: "text", overview: "text", location: "text" });

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;
