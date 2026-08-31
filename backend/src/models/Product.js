import mongoose from "mongoose";

const productFeatureSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed },
  icon: { type: String, default: "sparkles" },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
}, { _id: false });

const applicationCardSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed },
  industry: { type: String, default: "" },
  badge: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  bullets: [{ type: String }],
}, { _id: false });

const faqItemSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed },
  question: { type: String, default: "" },
  answer: { type: String, default: "" },
}, { _id: false });

const relatedProductItemSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed },
  categoryTag: { type: String, default: "" },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  slug: { type: String, default: "" },
}, { _id: false });

const localizedContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  gradeValue: { type: String, default: "" },
  shortOverview: { type: String, default: "" },
  categoryTag: { type: String, default: "" },
  primaryIndustry: { type: String, default: "" },
  aboutTitle: { type: String, default: "" },
  aboutOverview: { type: String, default: "" },
  card1Title: { type: String, default: "Manufacturing Process" },
  manufacturingProcess: { type: String, default: "" },
  card2Title: { type: String, default: "Packaging & Logistics" },
  packagingLogistics: { type: String, default: "" },
  card3Title: { type: String, default: "Safety & Handling" },
  safetyHandling: { type: String, default: "" },
  card4Title: { type: String, default: "Bulk Pricing & Procurement" },
  bulkPricing: { type: String, default: "" },
  whyChooseTitle: { type: String, default: "Why Choose Leela Gulf as a Trusted Supplier?" },
  whyChooseLeela: { type: String, default: "" },
  applicationTags: [{ type: String }],
  features: [productFeatureSchema],
  applicationCards: [applicationCardSchema],
  faqs: [faqItemSchema],
  relatedHeading: { type: String, default: "Related Surfactants" },
  relatedProducts: [relatedProductItemSchema],
}, { _id: false });

const productSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  code: {
    type: String,
    trim: true,
    default: "",
  },
  casNumber: {
    type: String,
    trim: true,
    default: "",
  },
  inciName: {
    type: String,
    trim: true,
    default: "",
  },
  hsCode: {
    type: String,
    trim: true,
    default: "",
  },
  chemicalFormula: {
    type: String,
    trim: true,
    default: "",
  },
  images: [{
    type: String,
  }],
  tdsUrl: {
    type: String,
    default: "",
  },
  tdsFileName: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Published", "Draft"],
    default: "Published",
  },
  featured: {
    type: Boolean,
    default: false,
  },
  primaryIndustry: {
    type: String,
    default: "Industrial Chemicals",
  },
  categoryTag: {
    type: String,
    default: "SURFACTANTS",
  },
  en: {
    type: localizedContentSchema,
    required: true,
  },
  ar: {
    type: localizedContentSchema,
    default: () => ({}),
  },
}, {
  timestamps: true,
});

// Helper virtual / indexing for fast search
productSchema.index({ slug: 1 });
productSchema.index({ "en.title": "text", "ar.title": "text", code: "text", casNumber: "text" });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
