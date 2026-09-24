const express = require("express");
const validate = require("../middleware/validation.middleware.js");

const {
  complaintIdValidator,
  updateStatusValidator,
  resolveComplaintValidator,
} = require("../validators/handlerValidator.js");

const {
  getHandlerComplaints,
  getHandlerComplaint,
  updateComplaintStatus,
  resolveComplaint,
} = require("../controllers/handlerComplaint.controller.js");

const protect = require("../middleware/auth.middleware.js");
const authorize = require("../middleware/role.middleware.js");

const router = express.Router();

router.get("/complaints", protect, authorize("HANDLER"), getHandlerComplaints);

router.get(
  "/complaints/:id",
  protect,
  authorize("HANDLER"),
  getHandlerComplaint,
);

router.patch(
  "/complaints/:id/status",
  protect,
  authorize("HANDLER"),
  updateStatusValidator,
  validate,
  updateComplaintStatus,
);

router.patch(
  "/complaints/:id/resolve",
  protect,
  authorize("HANDLER"),
  resolveComplaintValidator,
  validate,
  resolveComplaint,
);

module.exports = router;
