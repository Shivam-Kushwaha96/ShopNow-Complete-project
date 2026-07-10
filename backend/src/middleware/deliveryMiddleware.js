const deliveryMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "delivery") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as delivery boy" });
  }
};

module.exports = { deliveryMiddleware };