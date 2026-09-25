const { body } = require("express-validator");
const AppError = require("../utils/AppError.js");

const validatePassword = (password) => {
  if (
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 20
  ) {
    throw new AppError("Password must be between 8 and 20 characters", 400);
  }
};

const registerValidator = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({
      min: 2,
      max: 50,
    })
    .withMessage("First name must be between 2 and 50 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({
      min: 2,
      max: 50,
    })
    .withMessage("Last name must be between 2 and 50 characters"),

  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isLength({
      min: 8,
      max: 20,
    })
    .withMessage("Password must be between 8 and 20 characters"),
];

const loginValidator = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  registerValidator,
  loginValidator,
  validatePassword,
};
