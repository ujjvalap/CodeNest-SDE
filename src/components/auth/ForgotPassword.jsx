import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../../shared/Spinner";
import { useSendSignupOtpMutation,useChangePasswordWithOtpMutation  } from "../../redux/api/api"; // Adjust path
import { setAuthError } from "../../redux/reducers/authSlice"; // Or authSlice

function ForgotPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sendOTP, setSendOTP] = useState(false);

  const [sendOtp, { isLoading: sendingOtp }] = useSendSignupOtpMutation();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordWithOtpMutation();

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleSendOtp = async () => {
    if (!email) {
      dispatch(setAuthError("Please enter a valid email"));
      return;
    }
    try {
      const res = await sendOtp(email).unwrap();
      localStorage.setItem("otpToken", res.otpToken);
      dispatch(setAuthError(res.message));
      setIsTimerRunning(true);
      setSendOTP(true);
    } catch (err) {
      dispatch(setAuthError(err?.data?.message || "Failed to send OTP"));
    }
  };

  const handleChangePassword = async () => {
    if (!email) return dispatch(setAuthError("Please enter your email"));

    if (newPassword !== confirmPassword) {
      return dispatch(setAuthError("Passwords do not match"));
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return dispatch(
        setAuthError(
          "Password must have 8+ characters, including uppercase, lowercase, number, and special character."
        )
      );
    }

    try {
      const res = await changePassword({
        email,
        newPassword,
        otp: verificationCode,
        otpToken: localStorage.getItem("otpToken"),
      }).unwrap();

      dispatch(setAuthError(res.message));
      localStorage.removeItem("otpToken");
      navigate("/login");
    } catch (err) {
      dispatch(setAuthError(err?.data?.message || "Failed to change password"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen -mt-20 px-4 py-10 lg:py-20 w-full lg:w-2/3 xl:w-1/2 mx-auto">
      <div className="w-8 h-8 mb-2">{(sendingOtp || changingPassword) && <Spinner />}</div>
      <div className="w-full max-w-screen-md p-7 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Forgot Password
        </h2>

        {/* Email input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <input
              type="email"
              placeholder="abcxyz@gmail.com"
              className="mt-1 block w-full lg:w-3/4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className={`ml-2 px-3 py-2 mt-1 rounded-md text-white font-bold ${
                isTimerRunning
                  ? "bg-gray-500"
                  : "bg-blue-500 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600"
              }`}
              onClick={!isTimerRunning ? handleSendOtp : null}
              disabled={isTimerRunning || sendingOtp}
            >
              {sendingOtp
                ? "Sending..."
                : isTimerRunning
                ? `Resend in ${timer}s`
                : "Send Code"}
            </button>
          </div>
        </div>

        {/* Code & Passwords */}
        {sendOTP && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Verification Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <button
              className="block w-full px-3 py-2 bg-blue-500 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold rounded-md"
              onClick={handleChangePassword}
              disabled={!verificationCode || changingPassword}
            >
              Change Password
            </button>
          </>
        )}

        <p className="text-center text-sm text-gray-600 mt-2">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-500 dark:text-orange-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

