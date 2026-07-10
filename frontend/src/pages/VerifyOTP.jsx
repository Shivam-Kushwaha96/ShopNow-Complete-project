import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", { userId, otp });
      toast.success("Email verified successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">🛍️ ShopNow</h1>
          <p className="text-gray-500 mt-2">Enter OTP sent to your email.</p>
        </div>

        {/* OTP Icon */}
        <div className="text-center text-6xl mb-6">📧</div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6 digit OTP"
              maxLength={6}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50">
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Back to Register */}
        <p className="text-center text-gray-500 mt-6">
          Didn't receive OTP?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 font-semibold hover:underline cursor-pointer">
            Register Again
          </span>
        </p>

      </div>
    </div>
  );
};

export default VerifyOTP;