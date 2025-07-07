import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../../shared/Spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  useSendSignupOtpMutation,
  useRegisterUserMutation,
} from "../../redux/api/api";
import {
  setUserType,
  setAuthError,
  selectAuthError,
} from "../../redux/reducers/authSlice";

function Signup() {
  const [credentials, setCredentials] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    cpassword: "",
    otp: "",
  });

  const [errors, setErrors] = useState({});
  const [canResendOtp, setCanResendOtp] = useState(true);
  const [remainingTime, setRemainingTime] = useState(60);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errorMessage = useSelector(selectAuthError);

  const [sendSignupOtp, { isLoading: otpSending }] = useSendSignupOtpMutation();
  const [registerUser, { isLoading: isSubmitting }] = useRegisterUserMutation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (!canResendOtp && remainingTime > 0) {
      timer = setInterval(() => setRemainingTime((prev) => prev - 1), 1000);
    } else if (remainingTime === 0) {
      setCanResendOtp(true);
      setRemainingTime(60);
    }
    return () => clearInterval(timer);
  }, [canResendOtp, remainingTime]);

  const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!credentials.fname || credentials.fname.length < 3)
      newErrors.fname = "First name must be at least 3 characters.";

    if (!credentials.lname) newErrors.lname = "Last name is required.";

    if (!credentials.email || !emailPattern.test(credentials.email))
      newErrors.email = "Invalid email address.";

    if (!credentials.password || !passwordPattern.test(credentials.password))
      newErrors.password =
        "Password must be 8+ chars with uppercase, lowercase, number, and special char.";

    if (credentials.cpassword !== credentials.password)
      newErrors.cpassword = "Passwords do not match.";

    if (!credentials.otp) newErrors.otp = "OTP is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOTP = async () => {
    if (!credentials.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email first." }));
      return;
    }

    try {
      const response = await sendSignupOtp({ email: credentials.email }).unwrap();
      localStorage.setItem("otpToken", response.otpToken);
      dispatch(setAuthError(response.message));
      setCanResendOtp(false);
    } catch (error) {
      console.error("OTP send error:", error);
      dispatch(setAuthError(error?.data?.message || "Failed to send OTP"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { fname, lname, email, password, otp } = credentials;

    try {
      const result = await registerUser({
        fname,
        lname,
        email,
        password,
        otp,
        otpToken: localStorage.getItem("otpToken"),
      }).unwrap();

      localStorage.removeItem("otpToken");
      localStorage.setItem("token", result.token);
      localStorage.setItem("userName", result.user.firstName);

      const type = ["Admin", "Super Admin"].includes(result.user.userType)
        ? result.user.userType
        : "User";

      localStorage.setItem("userType", type);
      dispatch(setUserType(type));
      dispatch(setAuthError("Account created Successfully"));

      navigate(type === "User" ? "/" : "/admin");
    } catch (err) {
      console.error("Register error:", err);
      dispatch(setAuthError(err?.data?.message || "Error creating account"));
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 w-screen md:w-full lg:w-2/3 xl:w-1/2 mx-auto">
      {(isSubmitting || otpSending) && <Spinner />}
      <div className="w-full max-w-md mt-2 p-8 bg-white dark:bg-gray-800 rounded-lg mb-16 shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-800 dark:text-white mb-7">
          Create an account
        </h2>

        {errorMessage && (
          <p className="text-sm text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>First Name *</label>
              <input type="text" name="fname" onChange={onChange} className="input" required />
              {errors.fname && <p className="text-sm text-red-500">{errors.fname}</p>}
            </div>
            <div>
              <label>Last Name *</label>
              <input type="text" name="lname" onChange={onChange} className="input" required />
              {errors.lname && <p className="text-sm text-red-500">{errors.lname}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label>Email *</label>
            <input type="email" name="email" onChange={onChange} className="input" required />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* OTP */}
          <div>
            <label>Verification Code *</label>
            <div className="flex items-center">
              <input type="text" name="otp" onChange={onChange} className="input" required />
              <button
                type="button"
                onClick={canResendOtp ? sendOTP : null}
                disabled={!canResendOtp || otpSending}
                className={`ml-2 px-3 py-2 rounded ${
                  canResendOtp
                    ? "bg-blue-500 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                    : "bg-gray-500"
                } text-white font-bold`}
              >
                {otpSending
                  ? "Sending..."
                  : canResendOtp
                  ? "Send Code"
                  : `Resend in ${remainingTime}s`}
              </button>
            </div>
            {errors.otp && <p className="text-sm text-red-500">{errors.otp}</p>}
          </div>

          {/* Password */}
          <div>
            <label>Password *</label>
            <input type="password" name="password" onChange={onChange} className="input" required />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label>Confirm Password *</label>
            <input type="password" name="cpassword" onChange={onChange} className="input" required />
            {errors.cpassword && <p className="text-sm text-red-500">{errors.cpassword}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full ${
              isSubmitting
                ? "bg-gray-500"
                : "bg-blue-500 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600"
            } text-white font-bold py-2 px-4 rounded`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 dark:text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
