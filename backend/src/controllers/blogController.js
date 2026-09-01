import Blog from "../models/Blog.js";
import { deleteCloudinaryAsset } from "./uploadController.js";

/**
 * Generate clean URL slug
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
 * Get all blogs with search, filtering, and pagination
 * GET /api/blogs
 */
export async function getBlogs(req, res) {
  try {
    const { status, category, search, startDate, endDate, page = 1, limit = 50 } = req.query;

    const filter = {};

    if (status && status !== "All Status") {
      filter.status = status;
    }

    if (category && category !== "All Categories") {
      filter.$or = [
        { category: { $regex: new RegExp(`^${category}$`, "i") } },
        { "en.category": { $regex: new RegExp(`^${category}$`, "i") } },
      ];
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

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [
        { "en.title": searchRegex },
        { "ar.title": searchRegex },
        { "en.excerpt": searchRegex },
        { "ar.excerpt": searchRegex },
        { slug: searchRegex },
        { category: searchRegex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Normalize response for frontend
    const formatted = blogs.map((b) => ({
      _id: b._id,
      id: b.slug,
      slug: b.slug,
      title: b.en?.title || b.slug,
      titleAr: b.ar?.title || "",
      category: b.category || b.en?.category || "General",
      categoryAr: b.ar?.category || "عام",
      categories: b.categories || b.en?.categories || [],
      status: b.status,
      views: b.views || 0,
      image: b.image || "",
      heroImage: b.image || "",
      authorImage: b.authorImage || "",
      authorLinkedIn: b.authorLinkedIn || "",
      authorEmail: b.authorEmail || "",
      date: b.date || new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      dateAr: b.ar?.date || b.date,
      readTime: b.en?.readTime || "5 Min Read",
      readTimeAr: b.ar?.readTime || "5 دقائق قراءة",
      excerpt: b.en?.excerpt || "",
      excerptAr: b.ar?.excerpt || "",
      content: b.en?.content || "",
      contentAr: b.ar?.content || "",
      author: b.en?.author || "Leela Gulf Editorial Team",
      authorAr: b.ar?.author || "فريق تحرير ليلا جلف",
      authorRole: b.en?.authorRole || "Author",
      authorRoleAr: b.ar?.authorRole || "كاتب",
      authorCompany: b.en?.authorCompany || "LEELA GULF",
      authorCompanyAr: b.ar?.authorCompany || "ليلا جلف",
      authorBio: b.en?.authorBio || "",
      authorBioAr: b.ar?.authorBio || "",
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      en: b.en,
      ar: b.ar,
    }));

    return res.status(200).json({
      success: true,
      data: formatted,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)) || 1,
      },
    });
  } catch (error) {
    console.error("Get Blogs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs.",
      error: error.message,
    });
  }
}

/**
 * Get single blog by slug or ID
 * GET /api/blogs/:slugOrId
 */
export async function getBlogBySlugOrId(req, res) {
  try {
    const { slugOrId } = req.params;

    let blog = null;
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(slugOrId);
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: slugOrId.toLowerCase() });
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    // Increment views silently on live visits
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Get Blog Detail Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog.",
      error: error.message,
    });
  }
}

/**
 * Create a new blog post
 * POST /api/blogs
 */
export async function createBlog(req, res) {
  try {
    const {
      title,
      slug: customSlug,
      category = "General",
      categories = [],
      status = "Published",
      image = "",
      authorImage = "",
      authorLinkedIn = "",
      authorEmail = "",
      excerpt = "",
      content = "",
      author = "",
      authorRole = "",
      authorCompany = "",
      authorBio = "",
      readTime = "5 Min Read",
      en: customEn,
      ar: customAr,
    } = req.body;

    const enPayload = customEn || {
      title,
      category,
      categories,
      excerpt,
      content,
      author,
      authorRole,
      authorCompany,
      authorBio,
      readTime,
    };

    if (!enPayload.title) {
      return res.status(400).json({
        success: false,
        message: "Blog title is required.",
      });
    }

    // Generate unique slug
    let baseSlug = customSlug ? slugify(customSlug) : slugify(enPayload.title || "blog");
    let slug = baseSlug;
    let counter = 1;
    while (await Blog.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const blog = new Blog({
      slug,
      category: category || enPayload.category || "General",
      categories: categories.length > 0 ? categories : (enPayload.categories || [category || "General"]),
      status: status || "Published",
      image: image || "",
      authorImage: authorImage || "",
      authorLinkedIn: authorLinkedIn || "",
      authorEmail: authorEmail || "",
      views: 0,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      en: enPayload,
      ar: customAr || null,
    });

    await blog.save();

    return res.status(201).json({
      success: true,
      message: "Blog created successfully.",
      data: blog,
    });
  } catch (error) {
    console.error("Create Blog Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create blog.",
      error: error.message,
    });
  }
}

/**
 * Update a blog post (Cleans up old Cloudinary image if replaced)
 * PUT /api/blogs/:id
 */
export async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    // Check if featured image was replaced and delete old Cloudinary image
    if (blog.image && updateData.image && blog.image !== updateData.image) {
      deleteCloudinaryAsset(blog.image).catch((err) =>
        console.error("Old blog image cleanup error:", err)
      );
    }

    // Check if author image was replaced and delete old Cloudinary image
    if (blog.authorImage && updateData.authorImage && blog.authorImage !== updateData.authorImage) {
      deleteCloudinaryAsset(blog.authorImage).catch((err) =>
        console.error("Old author image cleanup error:", err)
      );
    }

    Object.assign(blog, updateData);
    await blog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully.",
      data: blog,
    });
  } catch (error) {
    console.error("Update Blog Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update blog.",
      error: error.message,
    });
  }
}

/**
 * Delete a blog post (Permanently deletes Cloudinary images)
 * DELETE /api/blogs/:id
 */
export async function deleteBlog(req, res) {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    // Delete featured image from Cloudinary
    if (blog.image) {
      deleteCloudinaryAsset(blog.image).catch((err) =>
        console.error("Delete blog featured image cleanup error:", err)
      );
    }

    // Delete author image from Cloudinary
    if (blog.authorImage) {
      deleteCloudinaryAsset(blog.authorImage).catch((err) =>
        console.error("Delete blog author image cleanup error:", err)
      );
    }

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Blog post deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete blog.",
      error: error.message,
    });
  }
}
