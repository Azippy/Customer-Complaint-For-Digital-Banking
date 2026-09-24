const express = require("express");
const validate = require("../middleware/validation.middleware.js");

const {
  complaintIdValidator,
  assignComplaintValidator,
  rejectComplaintValidator,
} = require("../validators/adminValidator.js");

const {
  getAllComplaints,
  getAdminComplaint,
  assignComplaint,
  rejectComplaint,
  getHandlers,
} = require("../controllers/adminComplaint.controller.js");

const protect = require("../middleware/auth.middleware.js");
const authorize = require("../middleware/role.middleware.js");

const router = express.Router();

router.get("/handlers", protect, authorize("ADMIN"), getHandlers);

router.get("/complaints", protect, authorize("ADMIN"), getAllComplaints);

router.get(
  "/complaints/:id",
  protect,
  authorize("ADMIN"),
  complaintIdValidator,
  validate,
  getAdminComplaint,
);

router.patch(
  "/complaints/:id/assign",
  protect,
  authorize("ADMIN"),
  assignComplaintValidator,
  validate,
  assignComplaint,
);

router.patch(
  "/complaints/:id/reject",
  protect,
  authorize("ADMIN"),
  rejectComplaintValidator,
  validate,
  rejectComplaint,
);

module.exports = router;
