const User = require("../models/User");
const Order = require("../models/Order");
const { sendDeliveryOTPEmail, sendDeliveryNotificationEmail } = require("../utils/sendEmail");

// ─── Admin: Sab Delivery Boys Dekho ─────────────────────
const getAllDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await User.find({ role: "delivery" }).select("-password");
    res.status(200).json(deliveryBoys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Admin: Order Assign Karo — OTP Generate Karo ───────
const assignOrder = async (req, res) => {
  try {
    const { orderId, deliveryBoyId } = req.body;

    const order = await Order.findById(orderId)
      .populate("user", "username email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const deliveryBoy = await User.findById(deliveryBoyId);
    if (!deliveryBoy || deliveryBoy.role !== "delivery") {
      return res.status(404).json({ message: "Delivery boy not found" });
    }

    // OTP Generate Karo
    const deliveryOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const deliveryOTPExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    order.deliveryBoy = deliveryBoyId;
    order.deliveryBoyPhone = deliveryBoy.phone;
    order.status = "processing";
    order.deliveryOTP = deliveryOTP;
    order.deliveryOTPExpiry = deliveryOTPExpiry;
    await order.save();

    // User ko OTP Email Bhejo
    await sendDeliveryOTPEmail(order.user.email, deliveryOTP, order);

    // Socket — Admin ko notify karo
    global.io.to("admin_room").emit("order_assigned", {
      orderId: order._id,
      customerName: order.user.username,
      deliveryBoy: deliveryBoy.username,
    });

    res.status(200).json({ message: "Order assigned & OTP sent to user!" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delivery Boy: Apne Orders Dekho ────────────────────
const getMyDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryBoy: req.user._id })
      .populate("user", "username email phone")
      .populate("products.product", "name price image");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delivery Boy: OTP Verify Karo ──────────────────────
const verifyDeliveryOTP = async (req, res) => {
  try {
    const { orderId, otp } = req.body;

    const order = await Order.findById(orderId)
      .populate("user", "username email")
      .populate("deliveryBoy", "username phone")
      .populate("products.product", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    if (order.deliveryOTPExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired!" });
    }

    order.status = "delivered";
    order.deliveredAt = new Date();
    order.paymentStatus = "paid";
    order.deliveryOTP = undefined;
    order.deliveryOTPExpiry = undefined;
    await order.save();

    // Admin ko Email Bhejo
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      await sendDeliveryNotificationEmail(admin.email, order);
    }

    // Admin ko Socket Notification
    global.io.to("admin_room").emit("order_delivered", {
      orderId: order._id,
      customerName: order.user?.username,
      deliveryBoy: order.deliveryBoy?.username,
      totalPrice: order.totalPrice,
      deliveredAt: order.deliveredAt,
    });

    res.status(200).json({ message: "OTP verified! Order delivered successfully!" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delivery Boy: Status Update ────────────────────────
const updateDeliveryStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.deliveryBoy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    order.status = req.body.status;
    await order.save();
    res.status(200).json({ message: "Status updated!", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── User: Delivery Boy Details Dekho ───────────────────
const getDeliveryBoyDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("deliveryBoy", "username phone isAvailable");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.deliveryBoy) {
      return res.status(404).json({ message: "No delivery boy assigned yet" });
    }

    res.status(200).json({
      deliveryBoy: order.deliveryBoy,
      status: order.status,
      deliveredAt: order.deliveredAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDeliveryBoys,
  assignOrder,
  getMyDeliveries,
  updateDeliveryStatus,
  verifyDeliveryOTP,
  getDeliveryBoyDetails,
};