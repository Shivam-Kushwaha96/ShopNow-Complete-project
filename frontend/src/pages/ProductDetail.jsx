import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { addToCart, setShowCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/products/${id}`);
      setProduct(data);
    } catch (error) {
      toast.error("Product load nahi hua!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowCart(true);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    navigate("/checkout", { state: { product, quantity } });
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="text-center py-40">
        <div className="text-5xl mb-4">⏳</div>
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
      <Footer />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="text-center py-40">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-gray-500 text-lg">Product not found!</p>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-8">
          ← Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Left — Image */}
          <div>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden h-96 flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-9xl">🛍️</span>
              )}
            </div>
          </div>

          {/* Right — Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category */}
              <span className="bg-indigo-100 text-indigo-600 text-sm font-semibold px-3 py-1 rounded-full">
                {product.category}
              </span>

              {/* Name */}
              <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <p className="text-4xl font-bold text-indigo-600 mb-4">
                ₹{product.price}
              </p>

              {/* Description */}
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Stock */}
              <div className="flex items-center gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.stock > 0
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}>
                  {product.stock > 0 ? `✅ ${product.stock} in stock` : "❌ Out of Stock"}
                </span>
              </div>

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <p className="text-gray-600 font-medium">Quantity:</p>
                  <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-indigo-600 font-bold text-xl hover:text-indigo-800">
                      -
                    </button>
                    <span className="font-bold text-gray-800 w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="text-indigo-600 font-bold text-xl hover:text-indigo-800">
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 border-2 border-indigo-600 text-indigo-600 py-4 rounded-xl font-bold hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg">
                🛒 Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg">
                ⚡ Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { icon: "🚚", label: "Free Delivery" },
                { icon: "🔒", label: "Secure Payment" },
                { icon: "↩️", label: "Easy Returns" },
              ].map((f) => (
                <div key={f.label} className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <p className="text-gray-500 text-xs font-medium">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;