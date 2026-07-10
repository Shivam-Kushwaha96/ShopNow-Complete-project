const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// OTP Email
const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code - ShopNow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #4F46E5; text-align: center;">🛍️ ShopNow</h2>
        <h3 style="text-align: center;">Email Verification</h3>
        <p>Your OTP code is:</p>
        <div style="background: #f0f0ff; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <h1 style="color: #4F46E5; letter-spacing: 10px;">${otp}</h1>
        </div>
        <p style="color: #666;">Valid for <strong>10 minutes</strong> only.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
};

// Order Confirmation Email
const sendOrderConfirmationEmail = async (email, order) => {
  const productList = order.products
    .map((item) => `<li>Product ID: ${item.product} x ${item.quantity}</li>`)
    .join("");

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Order Confirmed! 🎉 - ShopNow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #4F46E5; text-align: center;">🛍️ ShopNow</h2>
        <h3 style="text-align: center; color: #22c55e;">Order Confirmed! 🎉</h3>
        <p>Tumhara order place ho gaya hai.</p>
        <h3>Order Details:</h3>
        <ul>${productList}</ul>
        <p><strong>Total Price: ₹${order.totalPrice}</strong></p>
        <p><strong>Status: ${order.status}</strong></p>
        <p><strong>Order ID: ${order._id}</strong></p>
        <br/>
        <p>Shipping Address:</p>
        <p>${order.shippingAddress.street}, ${order.shippingAddress.city}, 
           ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
      </div>
    `,
  });
};

// Delivery OTP Email
const sendDeliveryOTPEmail = async (email, otp, orderDetails) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🚚 Delivery OTP - ShopNow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #4F46E5; text-align: center;">🛍️ ShopNow</h2>
        <h3 style="text-align: center;">Your Delivery OTP</h3>
        <p>Apna order receive karne ke liye yeh OTP delivery boy ko dijiye:</p>
        <div style="background: #f0f0ff; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <h1 style="color: #4F46E5; letter-spacing: 10px;">${otp}</h1>
        </div>
        <p style="color: #666;">Order ID: <strong>${orderDetails._id}</strong></p>
        <p style="color: #666;">Total: <strong>₹${orderDetails.totalPrice}</strong></p>
        <p style="color: #f59e0b;"><strong>⚠️ Kisi ko share mat karein!</strong></p>
      </div>
    `,
  });
};

// ← Yeh missing tha — Admin Delivery Notification
const sendDeliveryNotificationEmail = async (adminEmail, order) => {
  const productList = order.products
    .map((item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product?.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">₹${item.product?.price * item.quantity}</td>
      </tr>
    `)
    .join("");

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: "✅ Order Delivered Successfully! - ShopNow",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #4F46E5; text-align: center;">🛍️ ShopNow</h2>
        <h3 style="text-align: center; color: #22c55e;">✅ Order Delivered!</h3>

        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 15px; margin: 15px 0;">
          <p style="margin: 0; color: #166534; font-weight: bold;">Order ID: ${order._id}</p>
          <p style="margin: 5px 0; color: #166534;">
            Delivered on: ${new Date(order.deliveredAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric",
              hour: "2-digit", minute: "2-digit"
            })}
          </p>
        </div>

        <h4 style="color: #374151;">👤 Customer</h4>
        <p>Name: <strong>${order.user?.username}</strong></p>
        <p>Email: <strong>${order.user?.email}</strong></p>

        <h4 style="color: #374151;">🚚 Delivery Boy</h4>
        <p>Name: <strong>${order.deliveryBoy?.username}</strong></p>
        <p>Phone: <strong>${order.deliveryBoy?.phone || "N/A"}</strong></p>

        <h4 style="color: #374151;">📦 Products</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 8px; text-align: left;">Product</th>
              <th style="padding: 8px; text-align: left;">Qty</th>
              <th style="padding: 8px; text-align: left;">Price</th>
            </tr>
          </thead>
          <tbody>${productList}</tbody>
        </table>

        <div style="background: #f0f0ff; border-radius: 8px; padding: 15px; margin-top: 15px; text-align: right;">
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #4F46E5;">
            Total: ₹${order.totalPrice}
          </p>
        </div>

        <h4 style="color: #374151;">📍 Shipping Address</h4>
        <p>${order.shippingAddress?.street}, ${order.shippingAddress?.city}, 
           ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}</p>
      </div>
    `,
  });
};

module.exports = {
  sendOTPEmail,
  sendOrderConfirmationEmail,
  sendDeliveryOTPEmail,
  sendDeliveryNotificationEmail,
};