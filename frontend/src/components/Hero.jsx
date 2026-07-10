import { Link } from "react-router-dom";
import React from "react";
const Hero = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24 px-6 text-center">
        <h2 className="text-5xl font-extrabold mb-4">Shop The Best Products</h2>
        <p className="text-lg text-indigo-100 mb-8">
          Discover amazing deals on top quality products!
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/products"
            className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-full hover:bg-indigo-50 text-lg">
            Shop Now 🛒
          </Link>
          <Link to="/register"
            className="border-2 border-white text-white font-bold px-8 py-3 rounded-full hover:bg-white hover:text-indigo-600 text-lg">
            Join Free
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Shop By Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Electronics", icon: "💻", bg: "bg-blue-100 text-blue-600" },
            { name: "Clothing", icon: "👕", bg: "bg-pink-100 text-pink-600" },
            { name: "Footwear", icon: "👟", bg: "bg-yellow-100 text-yellow-600" },
            { name: "Accessories", icon: "⌚", bg: "bg-green-100 text-green-600" },
          ].map((cat) => (
            <Link to="/products" key={cat.name}
              className={`${cat.bg} rounded-2xl p-8 text-center hover:scale-105 transition-transform`}>
              <div className="text-5xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-lg">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Laptop Pro", price: "₹50,000", tag: "Best Seller", icon: "💻" },
              { name: "Smartphone X", price: "₹20,000", tag: "New Arrival", icon: "📱" },
              { name: "Wireless Buds", price: "₹5,000", tag: "Hot Deal", icon: "🎧" },
            ].map((product) => (
              <div key={product.name}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-6">
                <div className="bg-indigo-50 rounded-xl h-48 flex items-center justify-center text-7xl mb-4">
                  {product.icon}
                </div>
                <span className="bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {product.tag}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mt-3">{product.name}</h3>
                <p className="text-indigo-600 font-bold text-lg mt-1">{product.price}</p>
                <Link to="/products"
                  className="block mt-4 bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-700">
                  View Product
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "🚚", title: "Fast Delivery", desc: "Get your products delivered within 2-3 days." },
            { icon: "🔒", title: "Secure Payment", desc: "100% secure and encrypted payments." },
            { icon: "↩️", title: "Easy Returns", desc: "Hassle free 7 day return policy." },
          ].map((feature) => (
            <div key={feature.title}
              className="bg-white rounded-2xl shadow p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;