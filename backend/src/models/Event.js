import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    titleAr: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: String,
      required: [true, "Event date is required"],
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    gallery: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
    },
    descriptionAr: {
      type: String,
      trim: true,
      default: "",
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    shortDescriptionAr: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
      index: true,
    },
    category: {
      type: String,
      default: "past",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching and sorting
eventSchema.index({ createdAt: -1 });
eventSchema.index({ title: "text", description: "text" });

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;
