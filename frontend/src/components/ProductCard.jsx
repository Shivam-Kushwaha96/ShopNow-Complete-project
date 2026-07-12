import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, setShowCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6">

      {/* Image */}
      <div
        onClick={() => navigate(`/products/${product._id}`)}
        className="bg-indigo-50 rounded-xl h-48 flex items-center justify-center mb-4 overflow-hidden cursor-pointer">
        {product.image ? (
          <img src={product.image} alt={product.name}
            className="h-full w-full object-cover rounded-xl hover:scale-105 transition-transform" />
        ) : (
          <span className="text-7xl">🛍️</span>
        )}
      </div>

      {/* Category */}
      <span className="bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
        {product.category}
      </span>

      {/* Name */}
      <h3
        onClick={() => navigate(`/products/${product._id}`)}
        className="text-xl font-bold text-gray-800 mt-3 cursor-pointer hover:text-indigo-600">
        {product.name}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>

      {/* Price & Stock */}
      <div className="flex justify-between items-center mt-3">
        <p className="text-indigo-600 font-bold text-lg">₹{product.price}</p>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          product.stock > 0
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
        }`}>
          {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => navigate(`/products/${product._id}`)}
          className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 font-medium">
          👁️ View
        </button>
        <button
          onClick={() => { addToCart(product); setShowCart(true); }}
          disabled={product.stock === 0}
          className="flex-1 border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 font-medium disabled:opacity-50">
          🛒 Cart
        </button>
      </div>

    </div>
  );
};

export default ProductCard;