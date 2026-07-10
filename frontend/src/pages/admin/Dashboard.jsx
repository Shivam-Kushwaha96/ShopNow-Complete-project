import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import AdminLayout from "./AdminLayout";

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchAnalytics();

    // Admin room join karo
    socket.emit("join_admin");

    // Order delivered notification suno
    socket.on("order_delivered", (data) => {
      toast.success(`✅ Order Delivered! Customer: ${data.customerName}`);
      
      // Notification list mein add karo
      setNotifications((prev) => [data, ...prev]);
      
      // Analytics refresh karo
      fetchAnalytics();
    });

    return () => {
      socket.off("order_delivered");
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <div className="text-4xl mb-2">👥</div>
          <p className="text-gray-500">Total Users</p>
          <h2 className="text-3xl font-bold text-indigo-600">{analytics?.totalUsers}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <div className="text-4xl mb-2">🛒</div>
          <p className="text-gray-500">Total Orders</p>
          <h2 className="text-3xl font-bold text-indigo-600">{analytics?.totalOrders}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-gray-500">Total Products</p>
          <h2 className="text-3xl font-bold text-indigo-600">{analytics?.totalProducts}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <div className="text-4xl mb-2">💰</div>
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-3xl font-bold text-indigo-600">₹{analytics?.totalRevenue}</h2>
        </div>
      </div>

      {/* Real-time Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-2xl shadow mb-8">
          <div className="bg-green-50 px-6 py-4 border-b border-green-100">
            <h2 className="text-lg font-bold text-green-700">
              🔔 Recent Deliveries ({notifications.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {notifications.map((notif, index) => (
              <div key={index} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">
                    ✅ Order Delivered — {notif.customerName}
                  </p>
                  <p className="text-gray-400 text-sm">
                    By: {notif.deliveryBoy} | {new Date(notif.deliveredAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
                <p className="font-bold text-indigo-600">₹{notif.totalPrice}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <a href="/admin/products"
          className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition text-center">
          <div className="text-4xl mb-2">📦</div>
          <h3 className="font-bold text-gray-800">Products</h3>
        </a>
        <a href="/admin/orders"
          className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition text-center">
          <div className="text-4xl mb-2">🛒</div>
          <h3 className="font-bold text-gray-800">Orders</h3>
        </a>
        <a href="/admin/users"
          className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition text-center">
          <div className="text-4xl mb-2">👥</div>
          <h3 className="font-bold text-gray-800">Users</h3>
        </a>
        <a href="/admin/delivery"
          className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition text-center">
          <div className="text-4xl mb-2">🚚</div>
          <h3 className="font-bold text-gray-800">Delivery</h3>
        </a>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;