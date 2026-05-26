import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(90);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const { verifyUser, loginUser, btnLoading } = UserData();

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) navigate("/login");
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }

    setCanResend(true);
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const submitHandler = () => {
    if (!otp) return;
    verifyUser(Number(otp), navigate);
  };

  const resendHandler = () => {
    loginUser(email, navigate);
    setTimer(90);
    setCanResend(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Verify OTP
        </h2>

        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-6">
          <p className="text-sm text-blue-700">
            OTP sent to <span className="font-bold">{email}</span>
          </p>

          <p className="text-xs text-blue-500 mt-0.5">
            Check your inbox or spam folder
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter OTP
          </label>

          <input
            type="number"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitHandler()}
            placeholder="000000"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-500 transition-colors"
          />
        </div>

        <button
          onClick={submitHandler}
          disabled={btnLoading}
          className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-60"
        >
          {btnLoading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 mb-2">
            {canResend
              ? "You can resend OTP now"
              : `Resend in ${formatTime(timer)}`}
          </p>

          <button
            onClick={resendHandler}
            disabled={!canResend}
            className="text-sm text-gray-900 font-medium hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;