const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { deliveryMiddleware } = require("../middleware/deliveryMiddleware");
const {
  getAllDeliveryBoys,
  assignOrder,
  getMyDeliveries,
  updateDeliveryStatus,
  getDeliveryBoyDetails,
  verifyDeliveryOTP,
} = require("../controllers/deliveryController");

// Admin Routes
router.get("/boys", protect, admin, getAllDeliveryBoys);
router.post("/assign", protect, admin, assignOrder);

// Delivery Boy Routes
router.get("/my-deliveries", protect, deliveryMiddleware, getMyDeliveries);
router.put("/status/:id", protect, deliveryMiddleware, updateDeliveryStatus);
router.post("/verify-otp", protect, deliveryMiddleware, verifyDeliveryOTP);

// User Routes
router.get("/details/:orderId", protect, getDeliveryBoyDetails);

module.exports = router;