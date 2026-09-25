const Comment = require("../models/comment.model.js");
const Complaint = require("../models/complaint.model.js");
const AppError = require("../utils/AppError.js");

const { createAuditLog } = require("../services/auditLogService.js");

const {
  notifyComplaintEventInBackground,
  createNotification,
} = require("../services/notificationService.js");

const createComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      throw new AppError("Comment message is required", 400);
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      throw new AppError("Complaint not found", 404);
    }

    const user = req.user;

    const isAdmin = user.role === "ADMIN";

    const isOwner = complaint.submittedBy.toString() === user._id.toString();

    const isAssignedHandler =
      complaint.assignedTo &&
      complaint.assignedTo.toString() === user._id.toString();

    if (!isAdmin && !isOwner && !isAssignedHandler) {
      throw new AppError(
        "You are not authorized to comment on this complaint",
        403,
      );
    }

    const attachments = (req.files || []).map((file) => ({
      url: file.path,
      publicId: file.filename,
      originalName: file.originalname,
      fileType: file.mimetype,
    }));

    const comment = await Comment.create({
      complaint: complaint._id,
      user: user._id,
      message: message.trim(),
      attachments,
    });

    await createAuditLog({
      complaint: complaint._id,
      user: user._id,
      action: "COMMENTED",
      description: `${user.firstName} ${user.lastName} added a comment`,
    });

    notifyComplaintEventInBackground({
      complaint,
      event: "COMMENTED",
      actor: user,
    });

    await comment.populate("user", "firstName lastName email role");

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Create comment error:", error);
    next(error);
  }
};

const getComplaintComments = async (req, res, next) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      throw new AppError("Complaint not found", 404);
    }

    const user = req.user;

    const isAdmin = user.role === "ADMIN";

    const isOwner = complaint.submittedBy.toString() === user._id.toString();

    const isAssignedHandler =
      complaint.assignedTo &&
      complaint.assignedTo.toString() === user._id.toString();

    if (!isAdmin && !isOwner && !isAssignedHandler) {
      throw new AppError(
        "You are not authorized to view these comments",
        403,
      );
    }

    const comments = await Comment.find({
      complaint: complaint._id,
    })
      .populate("user", "firstName lastName email role")
      .sort({
        createdAt: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    next(error);
  }
};

module.exports = {
  createComment,
  getComplaintComments,
};
