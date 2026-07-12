import { Link } from "react-router-dom";
import React from "react";
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-400 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-xl mb-4">🛍️ ShopNow</h3>
          <p className="text-sm">Your one stop destination for all your shopping needs.</p>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/products" className="hover:text-white">Products</Link></li>
            <li><Link to="/orders" className="hover:text-white">Orders</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-bold mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li>📧 support@shopnow.com</li>
            <li>📞 +91 9696161653</li>
            <li>📍 Karwi, India</li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-8 text-sm border-t border-gray-700 pt-6">
        © 2026 ShopNow. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;