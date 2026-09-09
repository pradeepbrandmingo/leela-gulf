import Lead from "../models/Lead.js";
import { verifyEmailBackground } from "../utils/emailVerifier.js";

/**
 * @desc    Submit a new Lead / Contact Inquiry (Public Endpoint)
 * @route   POST /api/leads
 * @access  Public
 */
export const createLead = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      service,
      country,
      phone,
      message,
      sourcePage,
      productName,
      productSlug,
      productUrl,
      agreedToTerms,
    } = req.body;

    // Strict Backend Field Validations
    if (!firstName || !firstName.trim()) {
      return res.status(400).json({
        success: false,
        message: "First Name is required",
      });
    }

    if (!lastName || !lastName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Last Name is required",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email Address is required",
      });
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Run Automatic Background Email Verification (Checks DNS MX records & temp mail lists)
    const verification = await verifyEmailBackground(email.trim());

    // Create & Save Lead in MongoDB
    const newLead = await Lead.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      service: service ? service.trim() : "General Inquiry",
      country: country ? country.trim() : "United States",
      phone: phone ? phone.trim() : "",
      message: message.trim(),
      sourcePage: sourcePage ? sourcePage.trim() : "Contact Page",
      productName: productName ? productName.trim() : undefined,
      productSlug: productSlug ? productSlug.trim() : undefined,
      productUrl: productUrl ? productUrl.trim() : undefined,
      agreedToTerms: agreedToTerms !== undefined ? Boolean(agreedToTerms) : true,
      emailStatus: verification.emailStatus, // 'deliverable' | 'undeliverable' | 'unknown'
      emailReason: verification.emailReason || "",
      emailQuality: verification.emailQuality,
      emailScore: verification.score,
    });

    return res.status(201).json({
      success: true,
      message: "Thank you! Your inquiry has been submitted successfully.",
      lead: {
        id: newLead._id,
        firstName: newLead.firstName,
        lastName: newLead.lastName,
        email: newLead.email,
        emailStatus: newLead.emailStatus,
        createdAt: newLead.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all leads with pagination & search (Admin Protected)
 * @route   GET /api/leads
 * @access  Private / Admin
 */
export const getAllLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(100, parseInt(req.query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const { status, emailStatus, search, startDate, endDate, sourcePage, tab } = req.query;

    const query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (emailStatus && emailStatus !== "All") {
      query.emailStatus = emailStatus;
    }

    // Tab-based filtering (contactUs vs byProduct)
    if (tab === "contactUs") {
      query.$or = [
        { sourcePage: "Contact Page" },
        { sourcePage: { $regex: "contact", $options: "i" } },
      ];
    } else if (tab === "byProduct") {
      query.$or = [
        { productName: { $exists: true, $ne: "" } },
        { service: { $regex: "product", $options: "i" } },
        { sourcePage: { $regex: "product", $options: "i" } },
      ];
    }

    // Specific source page filter
    if (sourcePage && sourcePage !== "All Pages") {
      query.sourcePage = sourcePage;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    // Comprehensive text search
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      const searchConditions = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { service: searchRegex },
        { country: searchRegex },
        { productName: searchRegex },
        { message: searchRegex },
      ];

      if (query.$or) {
        // Combine tab $or condition with search $or condition using $and
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    // Execute queries in parallel
    const [total, leads, distinctPages] = await Promise.all([
      Lead.countDocuments(query),
      Lead.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Lead.distinct("sourcePage"),
    ]);

    const pageSources = Array.from(
      new Set(
        ["All Pages", ...(distinctPages || []).filter((p) => p && !p.toLowerCase().includes("blog"))]
      )
    );

    return res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit,
      leads,
      pageSources,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update lead status (Admin Protected)
 * @route   PATCH /api/leads/:id/status
 * @access  Private / Admin
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["New", "In Progress", "Contacted", "Closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      lead,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a lead (Admin Protected)
 * @route   DELETE /api/leads/:id
 * @access  Private / Admin
 */
export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
