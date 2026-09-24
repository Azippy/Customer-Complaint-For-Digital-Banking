const Notification = require("../models/notification.model.js");

const User = require("../models/user.model.js");

const { sendEmail } = require("./emailService.js");

const {
  complaintSubmittedEmail,
  complaintAssignedEmail,
  complaintStartedEmail,
  complaintCommentedEmail,
  complaintResolvedEmail,
  complaintRejectedEmail,
} = require("./emailTemplates.js");

const sendNotificationEmail = async ({ user, template }) => {
  if (!user?.email || !template) {
    return null;
  }

  return sendEmail({
    to: user.email,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });
};

const getUserById = async (userId) => {
  if (!userId) {
    return null;
  }

  return User.findById(userId).select("firstName lastName email role");
};

const createNotification = async ({
  recipient,
  complaint,
  type,
  title,
  message,
}) => {
  if (!recipient) {
    return null;
  }

  return Notification.create({
    recipient,
    complaint: complaint?._id || complaint,
    type,
    title,
    message,
  });
};

const notifyComplaintEvent = async ({
  complaint,
  event,
  actor = null,
  reason = null,
}) => {
  if (!complaint) {
    throw new Error("Complaint is required");
  }

  const owner = await getUserById(complaint.submittedBy);

  const handler = await getUserById(complaint.assignedTo);

  const admins = await User.find({
    role: "ADMIN",
  }).select("firstName lastName email role");

  const recipients = [];

  const addRecipient = (user) => {
    if (!user) {
      return;
    }

    const actorId = actor?._id?.toString();

    const userId = user._id.toString();

    if (actorId === userId) {
      return;
    }

    const alreadyAdded = recipients.some(
      (recipient) => recipient._id.toString() === userId,
    );

    if (!alreadyAdded) {
      recipients.push(user);
    }
  };

  if (event === "SUBMITTED") {
    admins.forEach(addRecipient);

    for (const recipient of recipients) {
      const template = complaintSubmittedEmail({
        firstName: recipient.firstName,
        complaintId: complaint.complaintId,
      });

      await createNotification({
        recipient: recipient._id,
        complaint,
        type: "COMPLAINT_SUBMITTED",
        title: "New Complaint",
        message: `A new complaint ${complaint.complaintId} has been submitted.`,
      });

      await sendNotificationEmail({
        user: recipient,
        template,
      });
    }

    return;
  }

  if (event === "ASSIGNED") {
    addRecipient(handler);
    addRecipient(owner);

    for (const recipient of recipients) {
      const isHandler =
        handler && recipient._id.toString() === handler._id.toString();

      const template = complaintAssignedEmail({
        firstName: recipient.firstName,
        complaintId: complaint.complaintId,
      });

      await createNotification({
        recipient: recipient._id,
        complaint,
        type: "COMPLAINT_ASSIGNED",
        title: "Complaint Assigned",
        message: isHandler
          ? `Complaint ${complaint.complaintId} has been assigned to you.`
          : `Your complaint ${complaint.complaintId} has been assigned to a handler.`,
      });

      await sendNotificationEmail({
        user: recipient,
        template,
      });
    }

    return;
  }

  if (event === "STARTED") {
    addRecipient(owner);

    for (const recipient of recipients) {
      const template = complaintStartedEmail({
        firstName: recipient.firstName,
        complaintId: complaint.complaintId,
      });

      await createNotification({
        recipient: recipient._id,
        complaint,
        type: "COMPLAINT_STARTED",
        title: "Complaint In Progress",
        message: `Your complaint ${complaint.complaintId} is now being processed.`,
      });

      await sendNotificationEmail({
        user: recipient,
        template,
      });
    }

    return;
  }

  if (event === "COMMENTED") {
    if (actor?.role === "USER") {
      addRecipient(handler);

      admins.forEach(addRecipient);
    } else if (actor?.role === "HANDLER") {
      addRecipient(owner);

      admins.forEach(addRecipient);
    } else if (actor?.role === "ADMIN") {
      addRecipient(owner);
      addRecipient(handler);
    }

    for (const recipient of recipients) {
      const template = complaintCommentedEmail({
        firstName: recipient.firstName,
        complaintId: complaint.complaintId,
      });

      await createNotification({
        recipient: recipient._id,
        complaint,
        type: "COMPLAINT_COMMENTED",
        title: "New Complaint Reply",
        message: `There is a new comment on complaint ${complaint.complaintId}.`,
      });

      await sendNotificationEmail({
        user: recipient,
        template,
      });
    }

    return;
  }

  if (event === "RESOLVED") {
    addRecipient(owner);

    for (const recipient of recipients) {
      const template = complaintResolvedEmail({
        firstName: recipient.firstName,
        complaintId: complaint.complaintId,
      });

      await createNotification({
        recipient: recipient._id,
        complaint,
        type: "COMPLAINT_RESOLVED",
        title: "Complaint Resolved",
        message: `Your complaint ${complaint.complaintId} has been resolved.`,
      });

      await sendNotificationEmail({
        user: recipient,
        template,
      });
    }

    return;
  }

  if (event === "REJECTED") {
    addRecipient(owner);

    for (const recipient of recipients) {
      const template = complaintRejectedEmail({
        firstName: recipient.firstName,
        complaintId: complaint.complaintId,
        reason: reason || "No reason provided.",
      });

      await createNotification({
        recipient: recipient._id,
        complaint,
        type: "COMPLAINT_REJECTED",
        title: "Complaint Rejected",
        message: `Your complaint ${complaint.complaintId} has been rejected.`,
      });

      await sendNotificationEmail({
        user: recipient,
        template,
      });
    }

    return;
  }
};

// const createNotification = async ({
//   recipient,
//   complaint = null,
//   type,
//   title,
//   message,
// }) => {
//   return Notification.create({
//     recipient,
//     complaint,
//     type,
//     title,
//     message,
//   });
// };

// const notifyUser = async ({ complaint, sender, event }) => {
//   let recipientId;
//   let title;
//   let message;
//   let type;

//   /*
//    * Someone commented on the complaint
//    */
//   if (event === "COMMENT_ADDED") {
//     if (sender.role === "USER") {
//       recipientId = complaint.assignedTo;
//     } else {
//       recipientId = complaint.submittedBy;
//     }

//     type = "SYSTEM";

//     title = "New Complaint Comment";

//     message = `There is a new comment on complaint ${complaint.complaintId}.`;
//   }

//   if (!recipientId) {
//     return null;
//   }

//   const notification = await Notification.create({
//     recipient: recipientId,
//     complaint: complaint._id,
//     type,
//     title,
//     message,
//   });

//   return notification;
// };

module.exports = {
  createNotification,
  notifyComplaintEvent,
};
