const bcrypt = require("bcryptjs");

const User = require("../models/user.model.js");
const generateToken = require("../utils/generateToken.js");
const AppError = require("../utils/AppError.js");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/emailService.js");
const { validatePassword } = require("../validators/authValidator.js");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      throw new AppError("All fields are required", 400);
    }

    validatePassword(password);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Registration successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new AppError("please register to continue", 404);
    }

    if (!user.isActive) {
      throw new AppError("Your account has been deactivated", 403);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    /*
     * Don't reveal whether an email exists.
     * This prevents account enumeration.
     */
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save({
      validateBeforeSave: false,
    });

    /*
     * For now, the frontend URL can come from .env
     */
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendPasswordResetEmail({
      email: user.email,
      name: user.firstName,
      resetUrl,
    });

    return res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;

    const { password } = req.body;

    if (!token) {
      throw new AppError("Reset token is required", 400);
    }

    if (!password) {
      throw new AppError("New password is required", 400);
    }

    if (password.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400);
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      throw new AppError("Invalid or expired reset token", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    /*
     * Invalidate the token immediately
     */
    user.resetPasswordToken = null;

    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  resetPassword,
  forgotPassword,
  register,
  login,
};
