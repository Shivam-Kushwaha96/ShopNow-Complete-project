const express = require("express");
const { registerUser, verifyOTP, loginUser, getUsers, makeDelivery,makeAdmin,deleteUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");


const router = express.Router();

router.post("/register",registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.get("/user", protect,admin,getUsers);
//router.post("/login",loginUser);
//router.post("/user",logoutUser);
router.put("/users/:id/make-admin", protect, admin, makeAdmin);
router.put("/users/:id/make-delivery", protect, admin, makeDelivery);
router.delete("/users/:id", protect, admin, deleteUser);


module.exports = router;