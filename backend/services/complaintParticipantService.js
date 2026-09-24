const User = require("../models/user.model.js");

const getComplaintParticipants = async (complaint) => {
  const participants = [];

  if (complaint.submittedBy) {
    participants.push(complaint.submittedBy.toString());
  }

  if (complaint.assignedTo) {
    participants.push(complaint.assignedTo.toString());
  }

  const admins = await User.find({
    role: "ADMIN",
  }).select("_id");

  admins.forEach((admin) => {
    participants.push(admin._id.toString());
  });

  return [...new Set(participants)];
};

module.exports = {
  getComplaintParticipants,
};
