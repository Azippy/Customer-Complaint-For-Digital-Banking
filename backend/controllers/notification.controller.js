const Notification = require("../models/notification.model.js");

const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;

    const currentPage = Math.max(Number(page), 1);

    const currentLimit = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (currentPage - 1) * currentLimit;

    const filter = {
      recipient: req.user._id,
    };

    if (unreadOnly === "true") {
      filter.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .populate("complaint", "complaintId title status")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(currentLimit)
        .lean(),

      Notification.countDocuments(filter),

      Notification.countDocuments({
        recipient: req.user._id,
        isRead: false,
      }),
    ]);

    const totalPages = Math.ceil(total / currentLimit);

    return res.status(200).json({
      success: true,

      data: notifications,

      unreadCount,

      pagination: {
        total,
        page: currentPage,
        limit: currentLimit,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while retrieving notifications",
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id,
      },
      {
        isRead: true,
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
