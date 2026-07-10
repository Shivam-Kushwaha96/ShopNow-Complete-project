const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require("../utils/sendEmail");

const genrateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ─── Register ───────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { username, email, password, phone, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      role: role === "delivery" ? "delivery" : "user",
      otp,
      otpExpiry,
      isVerified: false,
    });

    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: "OTP sent to your email. Please verify.",
      userId: user._id,
    });

  } catch (error) {
    console.log("Register Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// ─── Verify OTP ─────────────────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Login ──────────────────────────────────────────────
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }
   
        if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first!" });
    }

    if (await bcrypt.compare(password, user.password)) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: genrateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid email and password" });
    }
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

// ─── Get Users ──────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
};

// ─── Make Admin ─────────────────────────────────────────
const makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "User already an admin!" });
    }

    user.role = "admin";
    await user.save();

    res.status(200).json({ message: `${user.username} is now an admin! ✅` });
  } catch (error) {
    console.log("makeAdmin Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const makeDelivery = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = "delivery";
    await user.save();
    res.status(200).json({ message: `${user.username} is now a delivery boy! ` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delete User ────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  getUsers,
  makeAdmin,   // ← add kiya
  deleteUser,
  makeDelivery  // ← add kiya
};