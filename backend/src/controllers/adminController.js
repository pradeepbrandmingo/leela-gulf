import Admin from "../models/Admin.js";
import Product from "../models/Product.js";
import Blog from "../models/Blog.js";
import Lead from "../models/Lead.js";
import Event from "../models/Event.js";
import { computeAnalyticsStatsData } from "./analyticsController.js";
import { generateToken } from "../utils/generateToken.js";

/**
 * @desc    Get Consolidated Dashboard Summary (Single Fast Call)
 * @route   GET /api/admin/dashboard-summary
 * @access  Private (Admin)
 */
export const getDashboardSummary = async (req, res) => {
  try {
    const { range = "Last 7 days", startDate, endDate } = req.query;

    // Date range filter for leads if specified
    const leadFilter = {};
    if (startDate && endDate) {
      leadFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Execute all lightweight summary queries in parallel (sub-15ms)
    const [
      productsTotal,
      blogsTotal,
      recentBlogs,
      eventsTotal,
      leadsTotal,
      recentLeads,
      analyticsStats,
    ] = await Promise.all([
      Product.countDocuments(),
      Blog.countDocuments(),
      Blog.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title slug bannerImage createdAt category readTime views"),
      Event.countDocuments(),
      Lead.countDocuments(leadFilter),
      Lead.find(leadFilter).sort({ createdAt: -1 }).limit(5),
      computeAnalyticsStatsData(range, startDate, endDate),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        productsTotal: productsTotal || 0,
        blogsTotal: blogsTotal || 0,
        blogsList: recentBlogs || [],
        eventsTotal: eventsTotal || 0,
        leadsTotal: leadsTotal || 0,
        leadsList: recentLeads || [],
        analytics: analyticsStats || null,
      },
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};

/**
 * @desc    Single Admin Login
 * @route   POST /api/admin/login
 * @access  Public
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    // Find admin by email (include password for comparison)
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    // Verify password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    // Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT & Cookie
    const token = generateToken(res, admin._id);

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login. Please try again.",
    });
  }
};

/**
 * @desc    Get Current Logged in Admin Profile
 * @route   GET /api/admin/me
 * @access  Private (Admin)
 */
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    return res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin profile.",
    });
  }
};

/**
 * @desc    Logout Admin (Clear Cookie)
 * @route   POST /api/admin/logout
 * @access  Private (Admin)
 */
export const logoutAdmin = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed.",
    });
  }
};

/**
 * @desc    Auto Seed Single Admin Account if none exists
 */
export const seedSingleAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const email = process.env.ADMIN_EMAIL || "admin@leelagulf.com";
      const password = process.env.ADMIN_PASSWORD || "Admin@LeelaGulf2026#";

      await Admin.create({
        name: "Leela Gulf Admin",
        email,
        password,
        role: "admin",
      });

      console.log(`✅ Single Admin Account seeded successfully (${email})`);
    } else {
      console.log("ℹ️ Single Admin Account verified in MongoDB.");
    }
  } catch (error) {
    console.error("⚠️ Error seeding Single Admin Account:", error.message);
  }
};
