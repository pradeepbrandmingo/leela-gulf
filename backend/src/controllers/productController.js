import Product from "../models/Product.js";
import { translateProductPayload } from "../utils/translator.js";

/**
 * Generate clean URL slug from title
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Create a new product (Auto-translates to Arabic if missing)
 */
export async function createProduct(req, res) {
  try {
    const {
      title,
      code,
      casNumber,
      inciName,
      hsCode,
      chemicalFormula,
      images,
      tdsUrl,
      tdsFileName,
      status = "Published",
      featured = false,
      primaryIndustry,
      categoryTag,
      gradeValue,
      shortOverview,
      aboutTitle,
      aboutOverview,
      card1Title,
      manufacturingProcess,
      card2Title,
      packagingLogistics,
      card3Title,
      safetyHandling,
      card4Title,
      bulkPricing,
      whyChooseTitle,
      whyChooseLeela,
      applicationTags = [],
      features = [],
      applicationCards = [],
      faqs = [],
      relatedHeading,
      relatedProducts = [],
      en: customEn,
      ar: customAr,
    } = req.body;

    if (!title && !customEn?.title) {
      return res.status(400).json({
        success: false,
        message: "Product title is required.",
      });
    }

    // Prepare English payload
    const enPayload = customEn || {
      title,
      gradeValue,
      shortOverview,
      categoryTag,
      primaryIndustry,
      aboutTitle,
      aboutOverview,
      card1Title,
      manufacturingProcess,
      card2Title,
      packagingLogistics,
      card3Title,
      safetyHandling,
      card4Title,
      bulkPricing,
      whyChooseTitle,
      whyChooseLeela,
      applicationTags,
      features,
      applicationCards,
      faqs,
      relatedHeading,
      relatedProducts,
    };

    // Auto-translate to Arabic if customAr is not provided or incomplete
    let arPayload = customAr;
    if (!arPayload || !arPayload.title) {
      try {
        arPayload = await translateProductPayload(enPayload, "ar");
      } catch (err) {
        console.error("Auto-translation error on save:", err.message);
        arPayload = enPayload; // fallback
      }
    }

    // Generate unique slug
    let baseSlug = slugify(enPayload.title || "product");
    let slug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const product = new Product({
      slug,
      code: code || `PRD-${Date.now().toString().slice(-4)}`,
      casNumber: casNumber || "",
      inciName: inciName || "",
      hsCode: hsCode || "",
      chemicalFormula: chemicalFormula || "",
      images: images || [],
      tdsUrl: tdsUrl || "",
      tdsFileName: tdsFileName || "",
      status: status || "Published",
      featured: Boolean(featured),
      primaryIndustry: primaryIndustry || enPayload.primaryIndustry || "Industrial Chemicals",
      categoryTag: categoryTag || enPayload.categoryTag || "SURFACTANTS",
      en: enPayload,
      ar: arPayload,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully with English & Arabic translations.",
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create product.",
      error: error.message,
    });
  }
}

/**
 * Get all products (with optional filtering and search)
 */
export async function getProducts(req, res) {
  try {
    const { status, industry, search, page = 1, limit = 50 } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (industry && industry !== "All Industries") {
      filter.$or = [
        { primaryIndustry: industry },
        { "en.primaryIndustry": industry },
      ];
    }

    if (search) {
      filter.$or = [
        { "en.title": { $regex: search, $options: "i" } },
        { "ar.title": { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
        { casNumber: { $regex: search, $options: "i" } },
        { categoryTag: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
      error: error.message,
    });
  }
}

/**
 * Get single product by slug or ID
 */
export async function getProductBySlugOrId(req, res) {
  try {
    const { slugOrId } = req.params;

    const product = await Product.findOne({
      $or: [{ slug: slugOrId }, { _id: slugOrId.match(/^[0-9a-fA-F]{24}$/) ? slugOrId : null }],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product.",
      error: error.message,
    });
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // If English was updated but Arabic was not passed, re-translate
    if (updateData.en && (!updateData.ar || !updateData.ar.title)) {
      try {
        updateData.ar = await translateProductPayload(updateData.en, "ar");
      } catch (err) {
        console.error("Auto-translation error on update:", err.message);
      }
    }

    Object.assign(product, updateData);
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update product.",
      error: error.message,
    });
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product.",
      error: error.message,
    });
  }
}
