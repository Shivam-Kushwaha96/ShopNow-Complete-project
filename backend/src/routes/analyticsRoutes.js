const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { getAnalytics } = require("../controllers/analyticsController");

// Sirf Admin dekh sakta hai
router.get("/", protect, admin, getAnalytics);

module.exports = router;