require("dotenv").config();
const express = require("express");
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('shopping backend is working');
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/delivery", deliveryRoutes);

module.exports = app;