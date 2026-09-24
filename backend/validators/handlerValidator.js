const { body, param } = require("express-validator");

const complaintIdValidator = [
  param("id").trim().notEmpty().withMessage("Complaint ID is required"),
];

const updateStatusValidator = [
  ...complaintIdValidator,

  body("status")
    .trim()
    .toUpperCase()
    .equals("IN_PROGRESS")
    .withMessage("Status must be IN_PROGRESS"),
];

const resolveComplaintValidator = [
  ...complaintIdValidator,

  body("resolution")
    .trim()
    .notEmpty()
    .withMessage("Resolution is required")
    .isLength({
      min: 5,
      max: 5000,
    })
    .withMessage("Resolution must be between 5 and 5000 characters"),
];

module.exports = {
  complaintIdValidator,
  updateStatusValidator,
  resolveComplaintValidator,
};
