import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

/**
 * Helper to upload buffer to Cloudinary using streams
 */
function uploadBufferToCloudinary(buffer, folder = "products", resourceType = "auto") {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `leela-gulf/${folder}`,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
}

/**
 * Handle Single Image or PDF Upload
 */
export async function uploadSingleFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const isPdf = req.file.mimetype === "application/pdf";
    const folder = isPdf ? "documents" : "products";
    const resourceType = isPdf ? "raw" : "image";

    const result = await uploadBufferToCloudinary(req.file.buffer, folder, resourceType);

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully to Cloudinary.",
      data: {
        url: result.secure_url || result.url,
        publicId: result.public_id,
        format: result.format,
        bytes: result.bytes,
        originalName: req.file.originalname,
      },
    });
  } catch (error) {
    console.error("Cloudinary Single Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Upload to Cloudinary failed.",
      error: error.message,
    });
  }
}

/**
 * Handle Multiple Images Upload
 */
export async function uploadMultipleFiles(req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded.",
      });
    }

    const uploadPromises = req.files.map((file) => {
      const isPdf = file.mimetype === "application/pdf";
      const folder = isPdf ? "documents" : "products";
      const resourceType = isPdf ? "raw" : "image";
      return uploadBufferToCloudinary(file.buffer, folder, resourceType);
    });

    const results = await Promise.all(uploadPromises);

    const urls = results.map((r) => r.secure_url || r.url);

    return res.status(200).json({
      success: true,
      message: `${results.length} files uploaded successfully to Cloudinary.`,
      urls,
      data: results.map((r, idx) => ({
        url: r.secure_url || r.url,
        publicId: r.public_id,
        originalName: req.files[idx].originalname,
      })),
    });
  } catch (error) {
    console.error("Cloudinary Multiple Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Batch upload to Cloudinary failed.",
      error: error.message,
    });
  }
}
