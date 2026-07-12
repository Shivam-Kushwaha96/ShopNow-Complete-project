import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { addToCart, setShowCart } = useCart();
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // ← add kiya

  const categories = ["All", "Electronics", "Clothing", "Footwear", "Accessories"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}api/products`);
      setProducts(data);
    } catch (error) {
      toast.error("Products load nahi hue!");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (product) => {
    if (!user) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    navigate("/checkout", { state: { product } });
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 text-center">
        <h1 className="text-4xl font-bold mb-2">Our Products</h1>
        <p className="text-indigo-100">Find the best products at best prices!</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  category === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-300 text-gray-600 hover:bg-indigo-50"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-gray-500 text-lg">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-gray-500 text-lg">No products found!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6">

                {/* Image — Click karne pe detail page */}
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

                <span className="bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {product.category}
                </span>

                {/* Name — Click karne pe detail page */}
                <h3
                  onClick={() => navigate(`/products/${product._id}`)}
                  className="text-xl font-bold text-gray-800 mt-3 cursor-pointer hover:text-indigo-600">
                  {product.name}
                </h3>

                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>

                <div className="flex justify-between items-center mt-3">
                  <p className="text-indigo-600 font-bold text-lg">₹{product.price}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    product.stock > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                  </span>
                </div>

                <div className="flex gap-3 mt-4">
                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="flex-1 border border-gray-300 text-white-600 py-2 rounded-lg hover:bg-blue-700 font-medium">
                    View Product
                  </button>
                  <button
                    onClick={() => { addToCart(product); setShowCart(true); }}
                    disabled={product.stock === 0}
                    className="flex-1 border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 font-medium disabled:opacity-50">
                    🛒 Cart
                  </button>
                  <button
                    onClick={() => handleBuy(product)}
                    disabled={product.stock === 0}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
                    ⚡ Buy
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;