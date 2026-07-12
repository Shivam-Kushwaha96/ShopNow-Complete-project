import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const DeliveryDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpForm, setOtpForm] = useState({ orderId: "", otp: "" });
  const [showOtpForm, setShowOtpForm] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}api/delivery/my-deliveries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch (error) {
      toast.error("Orders load nahi hue!");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/delivery/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated!");
      fetchOrders();
    } catch (error) {
      toast.error("Update failed!");
    }
  };

  const verifyOTP = async () => {
    try {
      await axios.post(
        '${import.meta.env.VITE_SERVER_URL}/api/delivery/verify-otp',
        otpForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("OTP verified! Order delivered! 🎉");
      setShowOtpForm(false);
      setOtpForm({ orderId: "", otp: "" });
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed!");
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-600";
      case "processing": return "bg-blue-100 text-blue-600";
      case "delivered": return "bg-green-100 text-green-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 text-center">
        <h1 className="text-4xl font-bold mb-2">🚚 Delivery Dashboard</h1>
        <p className="text-indigo-100">Manage your deliveries</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">{orders.length}</p>
            <p className="text-gray-500 text-sm">Total</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status !== "delivered").length}
            </p>
            <p className="text-gray-500 text-sm">Pending</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === "delivered").length}
            </p>
            <p className="text-gray-500 text-sm">Delivered</p>
          </div>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">⏳ Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500">Koi order assign nahi hua!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-md overflow-hidden">

                {/* Header */}
                <div className="bg-indigo-50 px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-xs">Order ID</p>
                    <p className="font-mono text-gray-700 text-sm">{order._id}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${statusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="p-6">
                  {/* Customer Info */}
                  <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                    <p className="text-indigo-600 font-semibold text-sm mb-2">👤 Customer Details</p>
                    <p className="text-gray-800 font-medium">{order.user?.username}</p>
                    <p className="text-gray-500 text-sm">{order.user?.email}</p>
                    <p className="text-gray-500 text-sm">📞 {order.user?.phone || "N/A"}</p>
                  </div>

                  {/* Products */}
                  <div className="space-y-3 mb-4">
                    {order.products?.map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <div className="bg-gray-50 rounded-xl h-12 w-12 flex items-center justify-center overflow-hidden">
                          {item.product?.image
                            ? <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover rounded-xl" />
                            : <span className="text-xl">🛍️</span>}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.product?.name}</p>
                          <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-indigo-600">₹{item.product?.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  {/* Address */}
                  <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4">
                    <p className="text-gray-400 text-xs mb-1">📍 Delivery Address</p>
                    <p className="text-gray-700 text-sm">
                      {order.shippingAddress?.street}, {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xl font-bold text-indigo-600">₹{order.totalPrice}</p>
                    {order.status === "delivered" && (
                      <span className="bg-green-100 text-green-600 px-4 py-2 rounded-lg font-medium text-sm">
                        ✅ Delivered on {new Date(order.deliveredAt).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {order.status !== "delivered" && (
                    <div className="space-y-3">
                      {/* Processing Button */}
                      {order.status !== "processing" && (
                        <button
                          onClick={() => updateStatus(order._id, "processing")}
                          className="w-full bg-blue-100 text-blue-600 py-3 rounded-xl hover:bg-blue-200 font-medium">
                          🔄 Mark as Processing
                        </button>
                      )}

                      {/* OTP Verify Section */}
                      {showOtpForm && otpForm.orderId === order._id ? (
                        <div className="bg-indigo-50 rounded-xl p-4">
                          <p className="text-indigo-600 font-semibold mb-3 text-center">
                            🔐 Customer ka OTP Enter Karo
                          </p>
                          <input
                            type="text"
                            placeholder="6 digit OTP"
                            maxLength={6}
                            value={otpForm.otp}
                            onChange={(e) => setOtpForm({ ...otpForm, otp: e.target.value })}
                            className="w-full border border-indigo-300 rounded-lg px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={verifyOTP}
                              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">
                              ✅ Verify OTP
                            </button>
                            <button
                              onClick={() => {
                                setShowOtpForm(false);
                                setOtpForm({ orderId: "", otp: "" });
                              }}
                              className="flex-1 bg-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-300">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setShowOtpForm(true);
                            setOtpForm({ orderId: order._id, otp: "" });
                          }}
                          className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">
                          🔐 Enter Delivery OTP
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DeliveryDashboard;