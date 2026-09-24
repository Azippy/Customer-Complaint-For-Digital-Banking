const { body, param } = require("express-validator");

const createComplaintValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({
      min: 5,
      max: 150,
    })
    .withMessage("Title must be between 5 and 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({
      min: 10,
      max: 5000,
    })
    .withMessage("Description must be between 10 and 5000 characters"),

  body("category")
    .trim()
    .toUpperCase()
    .isIn(["PAYMENT", "ACCOUNT", "TECHNICAL", "SERVICE", "OTHER"])
    .withMessage("Invalid complaint category"),

  body("priority")
    .optional()
    .trim()
    .toUpperCase()
    .isIn(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .withMessage("Invalid complaint priority"),
];

const complaintIdValidator = [
  param("id").trim().notEmpty().withMessage("Complaint ID is required"),
];

const closeComplaintValidator = [...complaintIdValidator];

module.exports = {
  createComplaintValidator,
  complaintIdValidator,
  closeComplaintValidator,
};
