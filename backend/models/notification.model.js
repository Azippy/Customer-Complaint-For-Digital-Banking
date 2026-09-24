const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      default: null,
    },

    type: {
      type: String,
      enum: [
        "COMPLAINT_SUBMITTED",
        "COMPLAINT_ASSIGNED",
        "COMPLAINT_STARTED",
        "COMPLAINT_COMMENTED",
        "COMPLAINT_RESOLVED",
        "COMPLAINT_REJECTED",
        "COMPLAINT_CLOSED",
        "SYSTEM",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
