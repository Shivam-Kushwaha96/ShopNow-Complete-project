import { Routes, Route } from "react-router-dom";
import { useCart } from "./context/CartContext";
import Cart from "./components/Cart";


import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Products from "./pages/Products";

import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import Orders from "./pages/Orders";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import ProductDetail from "./pages/ProductDetail";
import Home from "./pages/Home";
import { Checkout } from "./pages/Checkout";

function App() {
  const { showCart, setShowCart } = useCart();

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login /> } />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/products" element={<Products />} /> 
        <Route path="/orders" element={<Orders />} />


        {/* Admin Routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/delivery" element={<DeliveryDashboard />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout/>} />
      </Routes>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-gray-50 w-full max-w-lg h-full overflow-y-auto p-6">
            <button onClick={() => setShowCart(false)}
              className="mb-4 text-gray-500 hover:text-gray-800 font-bold text-xl">
              ✕ Close
            </button>
            <Cart />
          </div>
        </div>
      )}
    </>
  );
}

export default App;