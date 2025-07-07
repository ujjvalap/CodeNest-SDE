import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useDispatch } from "react-redux";

import Spinner from "../../shared/Spinner";
import { useLoginUserMutation } from "../../redux/api/api";
import { setUserType , setAuthError } from "../../redux/reducers/authSlice";


function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const [loginUser, { isLoading }] = useLoginUserMutation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const onChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(credentials).unwrap();

      localStorage.setItem("token", res.token);
      localStorage.setItem("userName", res.user.firstName);

      const type =
        res.user.userType === "Admin" || res.user.userType === "Super Admin"
          ? res.user.userType
          : "User";

      localStorage.setItem("userType", type);
      dispatch(setUserType(type));

      navigate(type === "User" ? "/" : "/admin");
    } catch (err) {
      dispatch(setAuthError(err?.data?.message || "Login failed. Try again."));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center -mt-20 lg:justify-start lg:mt-20 2xl:mt-44 min-h-screen px-4 w-screen md:w-full lg:w-2/3 xl:w-1/2 mx-auto">
      <div className="w-8 h-8">{isLoading && <Spinner />}</div>
      <div className="w-full max-w-md p-7 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-800 dark:text-white mb-7">
          Have an Account?
        </h2>
        <form onSubmit={handleSubmission}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none"
              value={credentials.email}
              onChange={onChange}
              name="email"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md pr-10"
                value={credentials.password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            <Link
              to="/forgot-password"
              className="text-blue-500 dark:text-orange-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </p>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 dark:text-orange-400 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
