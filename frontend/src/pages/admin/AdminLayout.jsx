import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";

const AdminLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="px-6 py-6 border-b border-indigo-700">
          <h1 className="text-xl font-bold">🛍️ ShopNow</h1>
          <p className="text-indigo-300 text-sm mt-1">Admin Panel</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-700 transition">
            📊 Analytics
          </Link>
          <Link to="/admin/products"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-700 transition">
            📦 Products
          </Link>
          <Link to="/admin/orders"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indivo-700 transition">
            🛒 Orders
          </Link>
          <Link to="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-700 transition">
            👥 Users
          </Link>
          {/* ← Yahan daalo */}
          <Link to="/admin/delivery"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-700 transition">
            🚚 Delivery
          </Link>
        </nav>

        {/* User Info + Logout */}
        <div className="px-6 py-4 border-t border-indigo-700">
          <p className="text-indigo-300 text-sm">👋 {user?.username}</p>
          <button onClick={handleLogout}
            className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-medium">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white shadow-sm px-8 py-4">
          <p className="text-gray-500">Welcome back, <span className="font-bold text-indigo-600">{user?.username}</span></p>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>

    </div>
  );
};

export default AdminLayout;