import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { totalItems, setShowCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <Link to="/" onClick={closeMenu} className="text-xl sm:text-2xl font-bold text-indigo-600">
          🛍️ ShopNow
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-6 text-gray-600 font-medium">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/products" className="hover:text-indigo-600">Products</Link>
          {user && <Link to="/orders" className="hover:text-indigo-600">Orders</Link>}
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-indigo-600">Admin</Link>
          )}
          {user?.role === "delivery" && (
            <Link to="/delivery" className="hover:text-indigo-600">My Deliveries</Link>
          )}
        </div>

        {/* Right side: cart + auth (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-indigo-50 text-indigo-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-100">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Auth buttons - hidden on small screens, shown on md+ */}
          <div className="hidden md:flex items-center gap-3">
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

          {/* Hamburger button - mobile only */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3 text-gray-600 font-medium shadow-md">
          <Link to="/" onClick={closeMenu} className="hover:text-indigo-600">Home</Link>
          <Link to="/products" onClick={closeMenu} className="hover:text-indigo-600">Products</Link>
          {user && (
            <Link to="/orders" onClick={closeMenu} className="hover:text-indigo-600">Orders</Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" onClick={closeMenu} className="hover:text-indigo-600">Admin</Link>
          )}
          {user?.role === "delivery" && (
            <Link to="/delivery" onClick={closeMenu} className="hover:text-indigo-600">My Deliveries</Link>
          )}

          <hr className="my-1" />

          {user ? (
            <div className="flex flex-col gap-3">
              <span className="text-gray-600 font-medium">👋 {user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium w-full text-center">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 font-medium text-center">
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium text-center">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;