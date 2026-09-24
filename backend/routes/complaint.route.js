const express = require("express");
const validate = require("../middleware/validation.middleware.js");

const {
  createComplaintValidator,
  complaintIdValidator,
  closeComplaintValidator,
} = require("../validators/complaintValidator");

const {
  createComplaint,
  getMyComplaints,
  getComplaint,
  closeComplaint,
} = require("../controllers/complaint.controller.js");

const protect = require("../middleware/auth.middleware.js");

const authorize = require("../middleware/role.middleware.js");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("USER"),
  createComplaintValidator,
  validate,
  createComplaint,
);

router.get("/my", protect, authorize("USER"), getMyComplaints);

router.patch(
  "/:id/close",
  protect,
  authorize("USER"),
  closeComplaintValidator,
  validate,
  closeComplaint,
);

router.get(
  "/:id",
  protect,
  authorize("USER"),
  complaintIdValidator,
  validate,
  getComplaint,
);

module.exports = router;
