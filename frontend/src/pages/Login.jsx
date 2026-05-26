import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { UserData } from "../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const { loginUser, btnLoading } = UserData();

  // Send OTP
  const submitHandler = () => {
    if (!email) return;

    loginUser(email, navigate);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome back
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Enter your email to get an OTP
        </p>

        {/* Email input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && submitHandler()
            }
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-500 transition-colors"
          />
        </div>

        {/* Submit button */}
        <button
          onClick={submitHandler}
          disabled={btnLoading}
          className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-60"
        >
          {btnLoading ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
};

export default Login;