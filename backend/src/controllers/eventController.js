import Event from "../models/Event.js";
import { deleteCloudinaryAsset } from "./uploadController.js";

/**
 * Get all events with filtering, search, and date range support
 * GET /api/events
 */
export async function getEvents(req, res) {
  try {
    const { status, search, startDate, endDate, page = 1, limit = 100 } = req.query;

    const filter = {};

    // Filter by status (e.g. Published / Draft)
    if (status && status !== "ALL" && status !== "All Status") {
      filter.status = status;
    }

    // Filter by Date Range (createdAt)
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

    // Real-time Search Filter across title, description, date
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { title: searchRegex },
        { titleAr: searchRegex },
        { description: searchRegex },
        { descriptionAr: searchRegex },
        { date: searchRegex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: events,
    });
  } catch (error) {
    console.error("Get Events Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events.",
      error: error.message,
    });
  }
}

/**
 * Get single event by ID
 * GET /api/events/:id
 */
export async function getEventById(req, res) {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Increment views safely
    event.views = (event.views || 0) + 1;
    await event.save();

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Get Event By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch event.",
      error: error.message,
    });
  }
}

/**
 * Create a new event
 * POST /api/events
 */
export async function createEvent(req, res) {
  try {
    const {
      title,
      titleAr,
      date,
      image,
      gallery,
      description,
      descriptionAr,
      shortDescription,
      shortDescriptionAr,
      status,
      category,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Event title is required.",
      });
    }

    if (!date || !date.trim()) {
      return res.status(400).json({
        success: false,
        message: "Event date is required.",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Event description is required.",
      });
    }

    const mainImage = image || (Array.isArray(gallery) && gallery[0]) || "";
    const galleryList = Array.isArray(gallery) && gallery.length > 0 ? gallery : (mainImage ? [mainImage] : []);

    const newEvent = new Event({
      title: title.trim(),
      titleAr: titleAr ? titleAr.trim() : title.trim(),
      date: date.trim(),
      image: mainImage,
      gallery: galleryList,
      description: description.trim(),
      descriptionAr: descriptionAr ? descriptionAr.trim() : description.trim(),
      shortDescription: shortDescription ? shortDescription.trim() : description.trim().slice(0, 160),
      shortDescriptionAr: shortDescriptionAr ? shortDescriptionAr.trim() : (descriptionAr ? descriptionAr.trim().slice(0, 160) : description.trim().slice(0, 160)),
      status: status === "Draft" ? "Draft" : "Published",
      category: category || "past",
    });

    await newEvent.save();

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      data: newEvent,
    });
  } catch (error) {
    console.error("Create Event Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create event.",
      error: error.message,
    });
  }
}

/**
 * Update an existing event (Cleans up removed/replaced Cloudinary images)
 * PUT /api/events/:id
 */
export async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // 1. Check if main cover image was replaced/removed -> Delete old Cloudinary asset
    if (event.image && updateData.image && event.image !== updateData.image) {
      // Only delete if the old image is not kept in the new gallery list
      const newGallery = Array.isArray(updateData.gallery) ? updateData.gallery : [];
      if (!newGallery.includes(event.image)) {
        deleteCloudinaryAsset(event.image).catch((err) =>
          console.error("Old event cover image cleanup error:", err)
        );
      }
    }

    // 2. Check if any gallery images were removed -> Delete removed Cloudinary assets
    if (Array.isArray(event.gallery) && Array.isArray(updateData.gallery)) {
      const removedImages = event.gallery.filter(
        (oldUrl) => !updateData.gallery.includes(oldUrl) && oldUrl !== updateData.image
      );

      for (const removedUrl of removedImages) {
        deleteCloudinaryAsset(removedUrl).catch((err) =>
          console.error("Removed event gallery image cleanup error:", err)
        );
      }
    }

    // If main image not specified but gallery provided, set first gallery image as cover
    if (!updateData.image && Array.isArray(updateData.gallery) && updateData.gallery.length > 0) {
      updateData.image = updateData.gallery[0];
    }

    Object.assign(event, updateData);
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      data: event,
    });
  } catch (error) {
    console.error("Update Event Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update event.",
      error: error.message,
    });
  }
}

/**
 * Delete an event (Permanently deletes all associated Cloudinary images)
 * DELETE /api/events/:id
 */
export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Collect all unique Cloudinary image URLs belonging to this event
    const imagesToDelete = new Set();

    if (event.image) {
      imagesToDelete.add(event.image);
    }

    if (Array.isArray(event.gallery)) {
      event.gallery.forEach((url) => {
        if (url) imagesToDelete.add(url);
      });
    }

    // Clean up each image from Cloudinary
    for (const imgUrl of imagesToDelete) {
      deleteCloudinaryAsset(imgUrl).catch((err) =>
        console.error("Delete event Cloudinary image cleanup error:", err)
      );
    }

    await Event.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Event and all associated gallery images deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Event Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete event.",
      error: error.message,
    });
  }
}
