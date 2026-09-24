const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "PENDING",
        "ASSIGNED",
        "IN_PROGRESS",
        "RESOLVED",
        "REJECTED",
        "CLOSED",
      ],
      required: true,
    },

    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    _id: false,
  },
);

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["PAYMENT", "ACCOUNT", "TECHNICAL", "SERVICE", "OTHER"],
      required: true,
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "ASSIGNED",
        "IN_PROGRESS",
        "RESOLVED",
        "REJECTED",
        "CLOSED",
      ],
      default: "PENDING",
      index: true,
    },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    attachments: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
          required: true,
        },

        originalName: {
          type: String,
        },

        fileType: {
          type: String,
        },
      },
    ],

    assignedAt: {
      type: Date,
      default: null,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    resolution: {
      type: String,
      trim: true,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },

    statusHistory: [statusHistorySchema],
  },
  {
    timestamps: true,
  },
);

// complaintSchema.index({
//     submittedBy: 1,
//     createdAt: -1
// });

// complaintSchema.index({
//     assignedTo: 1,
//     status: 1,
//     createdAt: -1
// });

// complaintSchema.index({
//     status: 1,
//     createdAt: -1
// });

// complaintSchema.index({
//     category: 1,
//     status: 1
// });

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;

// module.exports = mongoose.model("Complaint", complaintSchema);
