import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const Checkout = () => {
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;
  const cartItems = location.state?.cartItems;

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState("");

  const [address, setAddress] = useState({
    name: user?.username || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const orderItems = product
    ? [{ product: product._id, quantity: 1 }]
    : cartItems?.map((item) => ({ product: item._id, quantity: item.quantity }));

  const totalPrice = product
    ? product.price
    : cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.pincode || !address.phone) {
      toast.error("Sab fields bharo!");
      return;
    }
    if (paymentMethod === "upi" && !upiTxnId) {
      toast.error("UPI Transaction ID daalo!");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/orders`,
        {
          products: orderItems,
          shippingAddress: {
            street: address.street,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
          },
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("🎉 Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Checkout</h1>
        <p className="text-indigo-100">Complete your order</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Steps */}
        <div className="flex items-center mb-10">
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-indigo-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 1 ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>1</div>
            <span className="font-medium">Delivery Address</span>
          </div>
          <div className={`flex-1 h-1 mx-4 rounded-full ${step >= 2 ? "bg-indigo-600" : "bg-gray-200"}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-indigo-600" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 2 ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>2</div>
            <span className="font-medium">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Left Side */}
          <div className="md:col-span-2">

            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">📍 Delivery Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">Full Name</label>
                      <input
                        name="name"
                        value={address.name}
                        onChange={handleAddressChange}
                        placeholder="Full Name"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">Phone Number</label>
                      <input
                        name="phone"
                        value={address.phone}
                        onChange={handleAddressChange}
                        placeholder="Phone Number"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Street Address</label>
                    <input
                      name="street"
                      value={address.street}
                      onChange={handleAddressChange}
                      placeholder="House No, Street, Area"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">City</label>
                      <input
                        name="city"
                        value={address.city}
                        onChange={handleAddressChange}
                        placeholder="City"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">State</label>
                      <input
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        placeholder="State"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">Pincode</label>
                      <input
                        name="pincode"
                        value={address.pincode}
                        onChange={handleAddressChange}
                        placeholder="Pincode"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!address.street || !address.city || !address.state || !address.pincode || !address.phone) {
                      toast.error("Sab fields bharo!");
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">💳 Payment Method</h2>

                <div className="space-y-4">

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`flex items-center gap-4 border-2 rounded-xl p-4 cursor-pointer transition ${
                      paymentMethod === "cod" ? "border-indigo-600 bg-indigo-50" : "border-gray-200"
                    }`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "cod" ? "border-indigo-600" : "border-gray-300"
                    }`}>
                      {paymentMethod === "cod" && <div className="w-3 h-3 rounded-full bg-indigo-600" />}
                    </div>
                    <div className="text-3xl">💵</div>
                    <div>
                      <p className="font-bold text-gray-800">Cash on Delivery</p>
                      <p className="text-gray-400 text-sm">Pay when your order arrives</p>
                    </div>
                  </div>

                  {/* UPI */}
                  <div
                    onClick={() => setPaymentMethod("upi")}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                      paymentMethod === "upi" ? "border-indigo-600 bg-indigo-50" : "border-gray-200"
                    }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "upi" ? "border-indigo-600" : "border-gray-300"
                      }`}>
                        {paymentMethod === "upi" && <div className="w-3 h-3 rounded-full bg-indigo-600" />}
                      </div>
                      <div className="text-3xl">📱</div>
                      <div>
                        <p className="font-bold text-gray-800">UPI Payment</p>
                        <p className="text-gray-400 text-sm">Pay via UPI QR Code</p>
                      </div>
                    </div>

                    {/* QR Code */}
                    {paymentMethod === "upi" && (
                      <div className="mt-4 flex flex-col items-center">
                        <div className="bg-white border-2 border-indigo-200 rounded-xl p-4 w-48 h-48 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl mb-2">📷</div>
                            <p className="text-gray-400 text-xs">UPI QR Code</p>
                            <p className="text-indigo-600 text-xs font-semibold mt-1">shopnow@upi</p>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm mt-3">Scan QR code to pay</p>
                        <p className="text-indigo-600 font-bold text-lg mt-1">₹{totalPrice}</p>
                        <input
                          type="text"
                          placeholder="Enter UPI Transaction ID"
                          value={upiTxnId}
                          onChange={(e) => setUpiTxnId(e.target.value)}
                          className="mt-3 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}
                  </div>

                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50">
                    ← Back
                  </button>
                  <button
                    onClick={handleOrder}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50">
                    {loading ? "Placing..." : "Place Order 🎉"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side — Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>

              {/* Single Product */}
              {product && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-50 rounded-xl h-14 w-14 flex items-center justify-center overflow-hidden">
                    {product.image
                      ? <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-xl" />
                      : <span className="text-2xl">🛍️</span>}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{product.name}</p>
                    <p className="text-indigo-600 font-bold">₹{product.price}</p>
                  </div>
                </div>
              )}

              {/* Cart Items */}
              {cartItems?.map((item) => (
                <div key={item._id} className="flex items-center gap-3 mb-3">
                  <div className="bg-indigo-50 rounded-xl h-12 w-12 flex items-center justify-center overflow-hidden">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-xl" />
                      : <span className="text-xl">🛍️</span>}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                    <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-indigo-600 font-bold text-sm">₹{item.price * item.quantity}</p>
                </div>
              ))}

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between text-gray-500 text-sm mb-2">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm mb-2">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between font-bold text-gray-800 text-lg mt-3 pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{totalPrice}</span>
                </div>
              </div>

              {/* Address Summary — Step 2 mein dikhao */}
              {step === 2 && (
                <div className="bg-indigo-50 rounded-xl p-3 mt-4">
                  <p className="text-indigo-600 text-xs font-semibold mb-1">📍 Delivering to:</p>
                  <p className="text-gray-700 text-xs font-medium">{address.name}</p>
                  <p className="text-gray-500 text-xs">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                  <p className="text-gray-500 text-xs">📞 {address.phone}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};
