const { body, param } = require("express-validator");

const complaintIdValidator = [
  param("id").trim().notEmpty().withMessage("Complaint ID is required"),
];

const assignComplaintValidator = [
  ...complaintIdValidator,

  body("handlerId")
    .trim()
    .notEmpty()
    .withMessage("handlerId is required")
    .isMongoId()
    .withMessage("handlerId must be a valid MongoDB ID"),
];

const rejectComplaintValidator = [
  ...complaintIdValidator,

  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Rejection reason is required")
    .isLength({
      min: 5,
      max: 1000,
    })
    .withMessage("Rejection reason must be between 5 and 1000 characters"),
];

module.exports = {
  complaintIdValidator,
  assignComplaintValidator,
  rejectComplaintValidator,
};
