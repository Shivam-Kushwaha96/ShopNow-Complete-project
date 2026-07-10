import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "./AdminLayout";

const AdminUsers = () => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (error) {
      toast.error("Users load nahi hue!");
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/auth/users/${id}/make-admin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User is now admin! ✅");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed!");
    }
  };

  const makeDelivery = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/auth/users/${id}/make-delivery`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User is now delivery boy! 🚚");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed!");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete karna chahte ho?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/auth/users/${id}`, // ← /api/auth/ kiya
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User deleted!");
      fetchUsers();
    } catch (error) {
      toast.error("Delete failed!");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">👥 Users</h1>

      {loading ? (
        <div className="text-center py-20 text-gray-500">⏳ Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-600">Username</th>
                <th className="px-6 py-4 text-left text-gray-600">Email</th>
                <th className="px-6 py-4 text-left text-gray-600">Phone</th>
                <th className="px-6 py-4 text-left text-gray-600">Role</th>
                <th className="px-6 py-4 text-left text-gray-600">Verified</th>
                <th className="px-6 py-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{user.username}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{user.phone || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.role === "admin"
                        ? "bg-indigo-100 text-indigo-600"
                        : user.role === "delivery"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.isVerified
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {user.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {user.role !== "admin" && (
                        <button onClick={() => makeAdmin(user._id)}
                          className="bg-indigo-100 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-200 text-sm font-medium">
                          Make Admin
                        </button>
                      )}
                      {user.role !== "delivery" && user.role !== "admin" && (
                        <button onClick={() => makeDelivery(user._id)}
                          className="bg-yellow-100 text-yellow-600 px-3 py-2 rounded-lg hover:bg-yellow-200 text-sm font-medium">
                          Make Delivery
                        </button>
                      )}
                      <button onClick={() => deleteUser(user._id)}
                        className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 text-sm font-medium">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;