import mongoose from "mongoose";

const localizedBlogContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "General" },
    categories: [{ type: String }],
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    author: { type: String, default: "" },
    authorRole: { type: String, default: "" },
    authorCompany: { type: String, default: "" },
    authorBio: { type: String, default: "" },
    readTime: { type: String, default: "5 Min Read" },
    metaTitle: { type: String, default: "" },
    metaDesc: { type: String, default: "" },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      index: true,
    },
    categories: [{ type: String }],
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "",
    },
    authorImage: {
      type: String,
      default: "",
    },
    authorLinkedIn: {
      type: String,
      default: "",
    },
    authorEmail: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: () =>
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
    en: {
      type: localizedBlogContentSchema,
      required: true,
    },
    ar: {
      type: localizedBlogContentSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ "en.title": "text", "ar.title": "text", "en.excerpt": "text" });

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
