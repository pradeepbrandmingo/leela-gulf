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
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { status, emailStatus, search, startDate, endDate } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (emailStatus) {
      query.emailStatus = emailStatus;
    }

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

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { service: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      leads,
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
