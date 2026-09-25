const AuditLog = require("../models/auditLog.model.js");

const Complaint = require("../models/complaint.model.js");
const AppError = require("../utils/AppError.js");

const getComplaintHistory = async (req, res, next) => {
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
        "You are not authorized to view this complaint history",
        403,
      );
    }

    const history = await AuditLog.find({
      complaint: complaint._id,
    })
      .populate("user", "firstName lastName email role")
      .sort({
        createdAt: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Get complaint history error:", error);
    next(error);
  }
};

module.exports = {
  getComplaintHistory,
};
