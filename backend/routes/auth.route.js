const express = require("express");
const validate = require("../middleware/validation.middleware.js");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator.js");

const { register, login } = require("../controllers/auth.controller.js");

const protect = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/register", registerValidator, validate, register);

router.post("/login", loginValidator, validate, login);

router.get("/me", protect, (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

module.exports = router;
