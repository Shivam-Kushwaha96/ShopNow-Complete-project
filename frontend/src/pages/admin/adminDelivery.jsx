import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout";

const AdminDelivery = () => {
  const { token } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ordersRes, boysRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_SERVER_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_SERVER_URL}/api/delivery/boys`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setOrders(ordersRes.data.filter((o) => o.status !== "delivered" && o.status !== "cancelled"));
      setDeliveryBoys(boysRes.data);
    } catch (error) {
      toast.error("Data load nahi hua!");
    } finally {
      setLoading(false);
    }
  };

  const assignOrder = async (orderId, deliveryBoyId) => {
    if (!deliveryBoyId) {
      toast.error("Delivery boy select karo!");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/delivery/assign`,
        { orderId, deliveryBoyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order assigned successfully!");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Assign failed!");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🚚 Delivery Management</h1>

      {/* Delivery Boys Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <div className="text-4xl mb-2">👨‍💼</div>
          <p className="text-gray-500">Total Delivery Boys</p>
          <h2 className="text-3xl font-bold text-indigo-600">{deliveryBoys.length}</h2>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-gray-500">Pending Orders</p>
          <h2 className="text-3xl font-bold text-yellow-600">
            {orders.filter((o) => !o.deliveryBoy).length}
          </h2>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 text-center">
          <div className="text-4xl mb-2">🚚</div>
          <p className="text-gray-500">Assigned Orders</p>
          <h2 className="text-3xl font-bold text-green-600">
            {orders.filter((o) => o.deliveryBoy).length}
          </h2>
        </div>
      </div>

      {/* Delivery Boys List */}
      <div className="bg-white rounded-2xl shadow mb-8 overflow-hidden">
        <div className="bg-indigo-50 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-800">👨‍💼 Delivery Boys</h2>
        </div>
        {deliveryBoys.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Koi delivery boy nahi hai!</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">Name</th>
                <th className="px-6 py-3 text-left text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-gray-600">Phone</th>
                <th className="px-6 py-3 text-left text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {deliveryBoys.map((boy) => (
                <tr key={boy._id} className="border-t border-gray-100">
                  <td className="px-6 py-4 font-medium text-gray-800">{boy.username}</td>
                  <td className="px-6 py-4 text-gray-600">{boy.email}</td>
                  <td className="px-6 py-4 text-gray-600">{boy.phone || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      boy.isAvailable
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {boy.isAvailable ? "Available" : "Busy"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Orders Assign */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="bg-indigo-50 px-6 py-4">
          <h2 className="text-lg font-bold text-gray-800">📦 Assign Orders</h2>
        </div>
        {loading ? (
          <div className="text-center py-10 text-gray-500">⏳ Loading...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Koi pending order nahi!</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">Order ID</th>
                <th className="px-6 py-3 text-left text-gray-600">User</th>
                <th className="px-6 py-3 text-left text-gray-600">Total</th>
                <th className="px-6 py-3 text-left text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-gray-600">Assigned To</th>
                <th className="px-6 py-3 text-left text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-gray-600 text-sm">
                    {order._id.slice(-8)}...
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{order.user?.username}</p>
                    <p className="text-gray-400 text-xs">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-indigo-600 font-bold">₹{order.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-blue-100 text-blue-600"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {order.deliveryBoy
                      ? <span className="text-green-600 font-medium">✅ Assigned</span>
                      : <span className="text-red-400">Not Assigned</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <select
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        defaultValue=""
                        id={`select-${order._id}`}>
                        <option value="" disabled>Select Boy</option>
                        {deliveryBoys.map((boy) => (
                          <option key={boy._id} value={boy._id}>
                            {boy.username}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          const select = document.getElementById(`select-${order._id}`);
                          assignOrder(order._id, select.value);
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium">
                        Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDelivery;