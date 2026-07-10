const Razorpay = require("razorpay");
const Order = require("../models/Order");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── Payment Order Create Karo ──────────────────────────
const createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Razorpay order banao
    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalPrice * 100, // paise mein hota hai
      currency: "INR",
      receipt: orderId,
    });

    res.status(201).json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: orderId,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Payment Verify Karo ────────────────────────────────
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    // Signature verify karo
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Order status update karo
    const order = await Order.findById(orderId);
    order.status = "processing";
    order.paymentStatus = "paid";
    order.paymentId = razorpayPaymentId;
    await order.save();

    res.status(200).json({ message: "Payment verified successfully!", order });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPayment, verifyPayment };