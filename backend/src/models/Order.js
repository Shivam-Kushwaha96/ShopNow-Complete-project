const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentId:{
    type:String
  },
  status: {
    type: String,
    enum: ["pending", "processing", "delivered", "cancelled"],
    default: "pending",
  },
    paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid",
  },
  paymentId:     { type: String, default: "" },
  
  shippingAddress: {
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    state:   { type: String, required: true },
    pincode: { type: String, required: true },
  },
 
deliveryBoy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
deliveryBoyPhone: { type: String },
deliveredAt: { type: Date },
deliveryOTP: { type: String },
deliveryOTPExpiry: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);