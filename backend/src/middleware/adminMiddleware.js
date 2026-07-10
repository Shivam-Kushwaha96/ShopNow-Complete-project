const jwt = require("jsonwebtoken");
const User = require("../models/User");

const admin = (req, res, next) => {
  // protect middleware pehle lagao — req.user set hoga
  if (req.user && req.user.role === "admin") {
    next(); // ← admin hai, aage jao
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

module.exports = { admin };