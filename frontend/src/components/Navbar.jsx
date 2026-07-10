import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { totalItems, setShowCart } = useCart();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          🛍️ ShopNow
        </Link>

        <div className="hidden md:flex gap-6 text-gray-600 font-medium">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/products" className="hover:text-indigo-600">Products</Link>
          {user && <Link to="/orders" className="hover:text-indigo-600">Orders</Link>}
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-indigo-600">Admin</Link>
          )}
          {/* ← Yahan daalo */}
          {user?.role === "delivery" && (
            <Link to="/delivery" className="hover:text-indigo-600">My Deliveries</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-600 font-medium">👋 {user.username}</span>
              <button onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login"
                className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 font-medium">
                Login
              </Link>
              <Link to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;