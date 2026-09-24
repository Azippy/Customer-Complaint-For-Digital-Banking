const { body } = require("express-validator");

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
      max: 128,
    })
    .withMessage("Password must be between 8 and 128 characters"),
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
};
