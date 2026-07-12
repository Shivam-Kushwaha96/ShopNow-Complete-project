import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const { token } = useSelector((state) => state.auth);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch (error) {
      toast.error("Orders load nahi hue!");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Order cancel karna chahte ho?")) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/orders/${id}/cancel`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order cancelled!");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed!");
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-600 border border-yellow-200";
      case "processing": return "bg-blue-100 text-blue-600 border border-blue-200";
      case "delivered": return "bg-green-100 text-green-600 border border-green-200";
      case "cancelled": return "bg-red-100 text-red-600 border border-red-200";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const TimelineStep = ({ label, icon, active, done }) => (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
        done ? "bg-indigo-600 text-white" :
        active ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600" :
        "bg-gray-100 text-gray-400"
      }`}>
        {icon}
      </div>
      <p className={`text-xs mt-1 font-medium ${done || active ? "text-indigo-600" : "text-gray-400"}`}>
        {label}
      </p>
    </div>
  );

  const TimelineLine = ({ done }) => (
    <div className={`flex-1 h-1 mx-1 rounded-full ${done ? "bg-indigo-600" : "bg-gray-200"}`} />
  );

  const getTimeline = (status) => {
    const steps = ["pending", "processing", "delivered"];
    const idx = steps.indexOf(status);
    return { idx, cancelled: status === "cancelled" };
  };

  const filteredOrders = filter === "All"
    ? orders
    : orders.filter((o) => o.status === filter.toLowerCase());

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-2">📦 My Orders</h1>
        <p className="text-indigo-100">Track and manage your orders</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", count: orders.length, color: "bg-indigo-50 text-indigo-600" },
            { label: "Pending", count: orders.filter(o => o.status === "pending").length, color: "bg-yellow-50 text-yellow-600" },
            { label: "Delivered", count: orders.filter(o => o.status === "delivered").length, color: "bg-green-50 text-green-600" },
            { label: "Cancelled", count: orders.filter(o => o.status === "cancelled").length, color: "bg-red-50 text-red-600" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.color} rounded-2xl p-4 text-center`}>
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {["All", "Pending", "Processing", "Delivered", "Cancelled"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-indigo-50"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Orders */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-gray-500 text-lg">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">No orders found!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const { idx, cancelled } = getTimeline(order.status);
              return (
                <div key={order._id} className="bg-white rounded-2xl shadow-md overflow-hidden">

                  {/* Header */}
                  <div className="bg-indigo-50 px-6 py-4 flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-xs">Order ID</p>
                      <p className="font-mono text-gray-700 text-sm font-medium">{order._id}</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${statusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="p-6">

                    {/* Timeline — SIRF EK BAAR */}
                    {!cancelled ? (
                      <div className="flex items-center mb-6">
                        <TimelineStep label="Pending" icon="⏳" done={idx >= 0} active={idx === 0} />
                        <TimelineLine done={idx >= 1} />
                        <TimelineStep label="Processing" icon="🔄" done={idx >= 1} active={idx === 1} />
                        <TimelineLine done={idx >= 2} />
                        <TimelineStep label="Delivered" icon="✅" done={idx >= 2} active={idx === 2} />
                      </div>
                    ) : (
                      <div className="bg-red-50 text-red-500 rounded-xl px-4 py-3 mb-6 text-sm font-medium text-center">
                        ❌ This order has been cancelled
                      </div>
                    )}

                    {/* Delivery Success Message */}
                    {order.status === "delivered" && (
                      <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-4 mb-4 flex items-center gap-4">
                        <div className="text-4xl">🎉</div>
                        <div>
                          <p className="text-green-700 font-bold text-lg">Order Delivered Successfully!</p>
                          <p className="text-green-500 text-sm mt-1">
                            Delivered on:{" "}
                            <span className="font-semibold">
                              {order.deliveredAt
                                ? new Date(order.deliveredAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "N/A"}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                    {/* Delivery Boy Details */}
{order.deliveryBoy && (
  <div className="bg-indigo-50 rounded-xl px-4 py-3 mt-4">
    <p className="text-indigo-600 text-xs font-semibold mb-2">🚚 Delivery Boy</p>
    <div className="flex items-center gap-3">
      <div className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
        {order.deliveryBoy?.username?.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="font-medium text-gray-800">{order.deliveryBoy?.username}</p>
        <p className="text-gray-500 text-sm">📞 {order.deliveryBoy?.phone || "N/A"}</p>
      </div>
    </div>
  </div>
)}

{/* Delivery OTP — user ko dikhao */}
{order.status === "processing" && order.deliveryOTP && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-6 py-4 mb-4">
    <p className="text-yellow-700 font-bold text-sm mb-1">
      🔐 Delivery OTP
    </p>
    <p className="text-yellow-600 text-xs mb-2">
      Yeh OTP delivery boy ko dijiye jab order receive karein
    </p>
    <div className="bg-white border border-yellow-300 rounded-lg px-4 py-3 text-center">
      <p className="text-3xl font-bold text-yellow-600 tracking-widest">
        {order.deliveryOTP}
      </p>
    </div>
    <p className="text-yellow-500 text-xs mt-2 text-center">
      ⚠️ Kisi aur ko share mat karein!
    </p>
  </div>
)}

                    {/* Products */}
                    <div className="space-y-3 border-t border-gray-100 pt-4">
                      {order.products?.map((item) => (
                        <div key={item._id} className="flex items-center gap-4">
                          <div className="bg-indigo-50 rounded-xl h-14 w-14 flex items-center justify-center overflow-hidden">
                            {item.product?.image
                              ? <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover rounded-xl" />
                              : <span className="text-2xl">🛍️</span>}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{item.product?.name}</p>
                            <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-indigo-600">₹{item.product?.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gray-50 rounded-xl px-4 py-3 mt-4">
                      <p className="text-gray-400 text-xs mb-1">📍 Shipping Address</p>
                      <p className="text-gray-700 text-sm">
                        {order.shippingAddress?.street}, {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-gray-400 text-xs">Total Amount</p>
                        <p className="text-2xl font-bold text-indigo-600">₹{order.totalPrice}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}>
                          {order.paymentStatus === "paid" ? "✅ Paid" : "❌ Unpaid"}
                        </span>
                        {order.status === "pending" && (
                          <button onClick={() => cancelOrder(order._id)}
                            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 font-medium text-sm">
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Orders;