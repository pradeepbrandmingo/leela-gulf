import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

// ═════════════════════════════════════════════════════════════════
// 1. PUBLIC JOBS CONTROLLER (FOR FRONTEND /careers PAGE)
// ═════════════════════════════════════════════════════════════════

/**
 * @desc Get all active published jobs for frontend
 * @route GET /api/careers/jobs
 */
export async function getPublishedJobs(req, res) {
  try {
    const { department, search } = req.query;
    const filter = { status: "Published" };

    if (department && department !== "ALL") {
      filter.department = new RegExp(`^${department.trim()}$`, "i");
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { titleAr: { $regex: q, $options: "i" } },
        { department: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { overview: { $regex: q, $options: "i" } },
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("getPublishedJobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch published job openings.",
      error: error.message,
    });
  }
}

/**
 * @desc Get single job by ID
 * @route GET /api/careers/jobs/:id
 */
export async function getJobById(req, res) {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job posting not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("getJobById Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve job details.",
      error: error.message,
    });
  }
}

// ═════════════════════════════════════════════════════════════════
// 2. ADMIN JOBS MANAGEMENT CONTROLLER
// ═════════════════════════════════════════════════════════════════

/**
 * @desc Get all jobs for Admin (Published & Drafts)
 * @route GET /api/careers/admin/jobs
 */
export async function getAdminJobs(req, res) {
  try {
    const { status, department, search, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status && status !== "ALL") {
      filter.status = status;
    }

    if (department && department !== "ALL") {
      filter.department = new RegExp(`^${department.trim()}$`, "i");
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { titleAr: { $regex: q, $options: "i" } },
        { department: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { overview: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean();

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      data: jobs,
    });
  } catch (error) {
    console.error("getAdminJobs Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin job openings.",
      error: error.message,
    });
  }
}

/**
 * @desc Create new Career Job Posting
 * @route POST /api/careers/jobs
 */
export async function createJob(req, res) {
  try {
    const {
      title,
      titleAr,
      department,
      departmentAr,
      location,
      locationAr,
      jobType,
      jobTypeAr,
      overview,
      overviewAr,
      responsibilities,
      responsibilitiesAr,
      requirements,
      requirementsAr,
      status,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job title is required in English.",
      });
    }

    if (!department || !department.trim()) {
      return res.status(400).json({
        success: false,
        message: "Department/Category is required.",
      });
    }

    if (!overview || !overview.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job overview summary is required.",
      });
    }

    const cleanedResp = Array.isArray(responsibilities)
      ? responsibilities.filter((r) => r && r.trim())
      : [];
    const cleanedRespAr = Array.isArray(responsibilitiesAr)
      ? responsibilitiesAr.filter((r) => r && r.trim())
      : [];
    const cleanedReq = Array.isArray(requirements)
      ? requirements.filter((r) => r && r.trim())
      : [];
    const cleanedReqAr = Array.isArray(requirementsAr)
      ? requirementsAr.filter((r) => r && r.trim())
      : [];

    const newJob = await Job.create({
      title: title.trim(),
      titleAr: titleAr?.trim() || "",
      department: department.trim(),
      departmentAr: departmentAr?.trim() || "",
      location: location?.trim() || "Dubai, UAE",
      locationAr: locationAr?.trim() || "دبي، الإمارات",
      jobType: jobType?.trim() || "Full-Time",
      jobTypeAr: jobTypeAr?.trim() || "دوام كامل",
      overview: overview.trim(),
      overviewAr: overviewAr?.trim() || "",
      responsibilities: cleanedResp,
      responsibilitiesAr: cleanedRespAr.length > 0 ? cleanedRespAr : cleanedResp,
      requirements: cleanedReq,
      requirementsAr: cleanedReqAr.length > 0 ? cleanedReqAr : cleanedReq,
      status: status === "Draft" ? "Draft" : "Published",
      applicationsCount: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Job opening published successfully.",
      data: newJob,
    });
  } catch (error) {
    console.error("createJob Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to publish job opening.",
      error: error.message,
    });
  }
}

/**
 * @desc Update existing Career Job Posting
 * @route PUT /api/careers/jobs/:id
 */
export async function updateJob(req, res) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.responsibilities && Array.isArray(updateData.responsibilities)) {
      updateData.responsibilities = updateData.responsibilities.filter((r) => r && r.trim());
    }
    if (updateData.responsibilitiesAr && Array.isArray(updateData.responsibilitiesAr)) {
      updateData.responsibilitiesAr = updateData.responsibilitiesAr.filter((r) => r && r.trim());
    }
    if (updateData.requirements && Array.isArray(updateData.requirements)) {
      updateData.requirements = updateData.requirements.filter((r) => r && r.trim());
    }
    if (updateData.requirementsAr && Array.isArray(updateData.requirementsAr)) {
      updateData.requirementsAr = updateData.requirementsAr.filter((r) => r && r.trim());
    }

    const updatedJob = await Job.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job posting not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job opening updated successfully.",
      data: updatedJob,
    });
  } catch (error) {
    console.error("updateJob Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update job opening.",
      error: error.message,
    });
  }
}

/**
 * @desc Delete Career Job Posting
 * @route DELETE /api/careers/jobs/:id
 */
export async function deleteJob(req, res) {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job posting not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job opening deleted successfully.",
      data: deletedJob,
    });
  } catch (error) {
    console.error("deleteJob Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete job opening.",
      error: error.message,
    });
  }
}

// ═════════════════════════════════════════════════════════════════
// 3. CANDIDATE APPLICATIONS / LEADS CONTROLLER
// ═════════════════════════════════════════════════════════════════

/**
 * @desc Submit Candidate Job Application from Frontend (/careers)
 * @route POST /api/careers/apply
 */
export async function submitJobApplication(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      currentLocation,
      residentialAddress,
      education,
      specialization,
      totalExperience,
      postAppliedFor,
      referralSource,
      resumeUrl,
      resumeName,
      coverNote,
      jobId,
    } = req.body;

    // Required Field Validations
    if (!firstName || !firstName.trim() || !lastName || !lastName.trim()) {
      return res.status(400).json({
        success: false,
        message: "First name and Last name are required.",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    if (!education || !education.trim()) {
      return res.status(400).json({
        success: false,
        message: "Highest education degree is required.",
      });
    }

    if (!specialization || !specialization.trim()) {
      return res.status(400).json({
        success: false,
        message: "Specialization / discipline is required.",
      });
    }

    if (!totalExperience || !totalExperience.trim()) {
      return res.status(400).json({
        success: false,
        message: "Total experience level is required.",
      });
    }

    if (!postAppliedFor || !postAppliedFor.trim()) {
      return res.status(400).json({
        success: false,
        message: "Target position applied for is required.",
      });
    }

    if (!resumeUrl || !resumeUrl.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume CV document (PDF).",
      });
    }

    const newApplication = await JobApplication.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      gender: gender?.trim() || "",
      currentLocation: currentLocation?.trim() || "Dubai, UAE",
      residentialAddress: residentialAddress?.trim() || "",
      education: education.trim(),
      specialization: specialization.trim(),
      totalExperience: totalExperience.trim(),
      postAppliedFor: postAppliedFor.trim(),
      referralSource: referralSource?.trim() || "Company Website",
      resumeUrl: resumeUrl.trim(),
      resumeName: resumeName?.trim() || `${firstName}_${lastName}_CV.pdf`,
      coverNote: coverNote?.trim() || "",
      jobId: jobId || null,
    });

    // Increment applications count on linked job (if matching)
    if (jobId) {
      await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } }).catch(() => null);
    } else if (postAppliedFor) {
      await Job.findOneAndUpdate(
        { title: new RegExp(`^${postAppliedFor.trim()}$`, "i") },
        { $inc: { applicationsCount: 1 } }
      ).catch(() => null);
    }

    return res.status(201).json({
      success: true,
      message: "Your job application has been submitted successfully.",
      data: newApplication,
    });
  } catch (error) {
    console.error("submitJobApplication Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit job application.",
      error: error.message,
    });
  }
}

/**
 * @desc Get all Candidate Applications / Leads for Admin
 * @route GET /api/careers/applications
 */
export async function getAdminApplications(req, res) {
  try {
    const { post, experience, search, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (post && post !== "ALL") {
      filter.postAppliedFor = new RegExp(`^${post.trim()}$`, "i");
    }

    if (experience && experience !== "ALL") {
      filter.totalExperience = new RegExp(`^${experience.trim()}$`, "i");
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { firstName: { $regex: q, $options: "i" } },
        { lastName: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
        { postAppliedFor: { $regex: q, $options: "i" } },
        { specialization: { $regex: q, $options: "i" } },
        { education: { $regex: q, $options: "i" } },
        { currentLocation: { $regex: q, $options: "i" } },
        { coverNote: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const total = await JobApplication.countDocuments(filter);
    const applications = await JobApplication.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .lean();

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / parseInt(limit, 10)) || 1,
      data: applications,
    });
  } catch (error) {
    console.error("getAdminApplications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidate applications.",
      error: error.message,
    });
  }
}

/**
 * @desc Get single Candidate Application by ID
 * @route GET /api/careers/applications/:id
 */
export async function getApplicationById(req, res) {
  try {
    const { id } = req.params;
    const app = await JobApplication.findById(id).lean();

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "Candidate application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: app,
    });
  } catch (error) {
    console.error("getApplicationById Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve application details.",
      error: error.message,
    });
  }
}

/**
 * @desc Delete Candidate Application
 * @route DELETE /api/careers/applications/:id
 */
export async function deleteJobApplication(req, res) {
  try {
    const { id } = req.params;
    const deletedApp = await JobApplication.findByIdAndDelete(id);

    if (!deletedApp) {
      return res.status(404).json({
        success: false,
        message: "Candidate application not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Candidate application deleted successfully.",
      data: deletedApp,
    });
  } catch (error) {
    console.error("deleteJobApplication Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete candidate application.",
      error: error.message,
    });
  }
}
