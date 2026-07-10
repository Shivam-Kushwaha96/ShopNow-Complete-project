import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = ({ cartItems, setCartItems }) => {
  const [loading, setLoading] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Quantity Update
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems(cartItems.map((item) =>
      item._id === id ? { ...item, quantity } : item
    ));
  };

  // Item Remove
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
    toast.info("Item removed from cart!");
  };

  // Total Price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity, 0
  );

  // Order Place
  const handleOrder = async () => {
    if (!user) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    setLoading(true);
    try {
      const products = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      await axios.post(
        "http://localhost:5000/api/orders",
        {
          products,
          shippingAddress: {
            street: "123 Main Street",
            city: "Delhi",
            state: "Delhi",
            pincode: "110001",
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order placed successfully!");
      setCartItems([]);
      navigate("/orders");
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

      {/* Cart Items */}
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item._id}
            className="flex items-center gap-4 border border-gray-100 rounded-xl p-4">

            {/* Image */}
            <div className="bg-indigo-50 rounded-xl h-16 w-16 flex items-center justify-center text-3xl">
              {item.image ? (
                <img src={item.image} alt={item.name}
                  className="h-full w-full object-cover rounded-xl" />
              ) : "🛍️"}
            </div>

            {/* Details */}
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">{item.name}</h3>
              <p className="text-indigo-600 font-semibold">₹{item.price}</p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                className="bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 font-bold">
                -
              </button>
              <span className="font-bold text-gray-800 w-6 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                className="bg-gray-100 px-3 py-1 rounded-lg hover:bg-gray-200 font-bold">
                +
              </button>
            </div>

            {/* Item Total */}
            <p className="font-bold text-gray-800 w-20 text-right">
              ₹{item.price * item.quantity}
            </p>

            {/* Remove */}
            <button
              onClick={() => removeItem(item._id)}
              className="text-red-500 hover:text-red-700 font-bold text-xl">
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 mt-6 pt-4 flex justify-between items-center">
        <div>
          <p className="text-gray-500">Total Items: {cartItems.length}</p>
          <p className="text-2xl font-bold text-indigo-600">₹{totalPrice}</p>
        </div>
        <button
          onClick={handleOrder}
          disabled={loading}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50">
          {loading ? "Placing Order..." : "Place Order 🛒"}
        </button>
      </div>
    </div>
  );
};

export default Cart;