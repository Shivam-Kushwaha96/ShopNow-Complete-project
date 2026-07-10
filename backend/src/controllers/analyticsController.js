const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

const getAnalytics = async (req, res) => {
  try {
    // Total Users
    const totalUsers = await User.countDocuments({ isVerified: true });

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Total Revenue
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    // Total Products
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalRevenue,
      totalProducts,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };