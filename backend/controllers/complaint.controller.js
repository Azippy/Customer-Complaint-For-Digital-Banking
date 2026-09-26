const Complaint = require("../models/complaint.model");
const generateComplaintId = require("../utils/generateComplaintId.js");
const { changeComplaintStatus } = require("../services/complaintService.js");
const { createAuditLog } = require("../services/auditLogService.js");
const {
  createNotification,
  notifyComplaintEventInBackground,
} = require("../services/notificationService.js");
const User = require("../models/user.model.js");
const AppError = require("../utils/AppError.js");

const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description || !category) {
      throw new AppError("Title, description and category are required", 400);
    }

    const attachments = (req.files || []).map((file) => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      fileType: file.mimetype,
    }));

    const complaintId = await generateComplaintId();

    const complaint = await Complaint.create({
      complaintId,
      title,
      description,
      category: category.toUpperCase(),
      priority: priority ? priority.toUpperCase() : "MEDIUM",
      submittedBy: req.user._id,
      attachments,
      status: "PENDING",
      statusHistory: [
        {
          status: "PENDING",
          changedBy: req.user._id,
          note: "Complaint submitted",
        },
      ],
    });

    const admins = await User.find({
      role: "ADMIN",
    }).select("_id");

    await Promise.all(
      admins.map((admin) =>
        createNotification({
          recipient: admin._id,
          complaint: complaint._id,
          type: "COMPLAINT_SUBMITTED",
          title: "New Complaint",
          message: `A new complaint (${complaint.complaintId}) has been submitted.`,
        }),
      ),
    );

    await createAuditLog({
      complaint: complaint._id,
      user: req.user._id,
      action: "SUBMITTED",
      newStatus: complaint.status,
      description: "Complaint submitted by user",
    });

    notifyComplaintEventInBackground({
      complaint,
      event: "SUBMITTED",
      actor: req.user,
    });

    return res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);
    next(error);
  }
};

const getMyComplaints = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, category, priority } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);

    const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 50);

    const skip = (pageNumber - 1) * limitNumber;

    const filter = {
      submittedBy: req.user._id,
    };

    if (status) {
      filter.status = status.toUpperCase();
    }

    if (category) {
      filter.category = category.toUpperCase();
    }

    if (priority) {
      filter.priority = priority.toUpperCase();
    }

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate("assignedTo", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),

      Complaint.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNumber);

    return res.status(200).json({
      complaints,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error("Get my complaints error:", error);
    next(error);
  }
};

const getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.id,
      submittedBy: req.user._id,
    })
      .populate("submittedBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email")
      .populate("statusHistory.changedBy", "firstName lastName role");

    if (!complaint) {
      throw new AppError("Complaint not found", 404);
    }

    return res.status(200).json({
      complaint,
    });
  } catch (error) {
    console.error("Get complaint error:", error);
    next(error);
  }
};

const closeComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.id,
      submittedBy: req.user._id,
    });

    if (!complaint) {
      throw new AppError("Complaint not found", 404);
    }

    if (complaint.status !== "RESOLVED") {
      throw new AppError("Only resolved complaints can be closed", 400);
    }

    complaint.closedAt = new Date();

    await changeComplaintStatus(
      complaint,
      "CLOSED",
      req.user._id,
      "Complaint closed by the complainant",
    );

    await createAuditLog({
      complaint: complaint._id,
      user: req.user._id,
      action: "CLOSED",
      oldStatus: "RESOLVED",
      newStatus: "CLOSED",
      description: "Complaint closed by user",
    });

    return res.status(200).json({
      message: "Complaint closed successfully",
      complaint,
    });
  } catch (error) {
    console.error("Close complaint error:", error);
    next(error);
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getComplaint,
  closeComplaint,
};
