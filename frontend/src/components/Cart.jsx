import { useSelector } from "react-redux";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    if (!user) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const products = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/orders`,
        {
          products,
          shippingAddress: {
            street: "123 Main St",
            city: "Delhi",
            state: "Delhi",
            pincode: "110001",
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Order failed!");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-gray-500 text-lg">Cart is empty!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🛒 My Cart</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item._id}
            className="flex items-center gap-4 border border-gray-100 rounded-xl p-4">
            <div className="bg-indigo-50 rounded-xl h-16 w-16 flex items-center justify-center text-3xl">
              {item.image
                ? <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-xl" />
                : "🛍️"}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{item.name}</h3>
              <p className="text-indigo-600 font-semibold">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 font-bold">-</button>
              <span className="font-bold text-gray-800 w-6 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 font-bold">+</button>
            </div>
            <p className="font-bold text-gray-800 w-20 text-right">
              ₹{item.price * item.quantity}
            </p>
            <button onClick={() => removeFromCart(item._id)}
              className="text-red-500 hover:text-red-700 font-bold text-xl">✕</button>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 mt-6 pt-4 flex justify-between items-center">
        <p className="text-2xl font-bold text-indigo-600">₹{totalPrice}</p>
        <button onClick={handleOrder} disabled={loading}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50">
          {loading ? "Placing..." : "Place Order 🛒"}
        </button>
      </div>
    </div>
  );
};

export default Cart;