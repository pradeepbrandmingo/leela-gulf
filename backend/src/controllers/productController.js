import Product from "../models/Product.js";
import { translateProductPayload } from "../utils/translator.js";
import { deleteCloudinaryAsset } from "./uploadController.js";

/**
 * Collect all Cloudinary asset URLs from a product object or update payload
 */
function collectProductAssetUrls(item) {
  const urls = [];
  if (!item) return urls;

  // Main images
  if (Array.isArray(item.images)) {
    item.images.forEach((img) => typeof img === "string" && img.includes("cloudinary.com") && urls.push(img));
  }

  // TDS PDF document
  if (typeof item.tdsUrl === "string" && item.tdsUrl.includes("cloudinary.com")) {
    urls.push(item.tdsUrl);
  }

  // Section 5: Application Cards (EN & AR)
  if (Array.isArray(item.en?.applicationCards)) {
    item.en.applicationCards.forEach(
      (card) => typeof card?.image === "string" && card.image.includes("cloudinary.com") && urls.push(card.image)
    );
  }
  if (Array.isArray(item.ar?.applicationCards)) {
    item.ar.applicationCards.forEach(
      (card) => typeof card?.image === "string" && card.image.includes("cloudinary.com") && urls.push(card.image)
    );
  }

  return [...new Set(urls)];
}

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
    const { status, industry, search, startDate, endDate, page = 1, limit = 50 } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
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
 * Update an existing product (Automatically cleans up old Cloudinary images/PDFs if replaced)
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

    // 1. Collect all old Cloudinary asset URLs from the database document
    const oldAssetUrls = collectProductAssetUrls(product);

    // 2. Re-translate if English was updated
    if (updateData.en && (!updateData.ar || !updateData.ar.title)) {
      try {
        updateData.ar = await translateProductPayload(updateData.en, "ar");
      } catch (err) {
        console.error("Auto-translation error on update:", err.message);
      }
    }

    // 3. Collect new asset URLs from the incoming update payload
    const newAssetUrls = collectProductAssetUrls(updateData);

    // 4. Identify old assets that were deleted or replaced
    const removedAssetUrls = oldAssetUrls.filter((oldUrl) => !newAssetUrls.includes(oldUrl));

    // 5. Apply changes and save to database
    Object.assign(product, updateData);
    await product.save();

    // 6. Delete replaced or removed files from Cloudinary asynchronously
    if (removedAssetUrls.length > 0) {
      Promise.allSettled(removedAssetUrls.map((url) => deleteCloudinaryAsset(url))).catch((err) =>
        console.error("[Product Update Cloudinary Cleanup Error]:", err)
      );
    }

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
 * Delete a product (Automatically cleans up all associated Cloudinary images & PDFs)
 */
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // 1. Collect all Cloudinary asset URLs attached to this product
    const assetUrls = collectProductAssetUrls(product);

    // 2. Delete product from MongoDB
    await Product.findByIdAndDelete(id);

    // 3. Delete all images, TDS PDF, and card images from Cloudinary asynchronously
    if (assetUrls.length > 0) {
      Promise.allSettled(assetUrls.map((url) => deleteCloudinaryAsset(url))).catch((err) =>
        console.error("[Product Delete Cloudinary Cleanup Error]:", err)
      );
    }

    return res.status(200).json({
      success: true,
      message: "Product and all associated Cloudinary files deleted successfully.",
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
