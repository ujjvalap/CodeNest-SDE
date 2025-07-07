import "./App.css";
import React, { useEffect, useState } from "react";
import NavBar from "./components/nevigation/NavBar";
import LoadingBar from "react-top-loading-bar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


import { useSelector, useDispatch } from "react-redux";
import {
  clearAuthError,
  setAuth,
} from "./redux/reducers/authSlice";


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ResetPassword from "./pages/ResetPassworrd";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Users from "./pages/Users";
import Category from "./pages/Category";

function App() {
  const dispatch = useDispatch();

  const mode = useSelector((state) => state.ui?.mode || "light");
  const progress = useSelector((state) => state.user?.progress || 0);
  const error = useSelector((state) => state.user?.error || null);

  const [showError, setShowError] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const userInfo = localStorage.getItem("userInfo");

    if (token && userType) {
      dispatch(
        setAuth({
          token,
          userType,
          userInfo: userInfo ? JSON.parse(userInfo) : null,
        })
      );
    }
  }, [dispatch]);


  useEffect(() => {
    if (error) {
      setShowError(true);
      toast.error(error, { toastId: "app-error" }); // prevent duplicate

      const timer = setTimeout(() => {
        setShowError(false);
        dispatch(clearAuthError());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  return (
    <div
      className={`${mode} min-h-screen bg-gray-100 dark:bg-slate-700 transition duration-500`}
    >
      <Router>
        <NavBar />
        <LoadingBar
          color={mode === "dark" ? "#FF7518" : "#f11946"}
          progress={progress}
        />

        {/* ✅ Toast Container (Global) */}
        <ToastContainer position="top-center" autoClose={3000} />

        {/* ✅ Error Banner (optional - still shows visually at top) */}
        <div className="error-container fixed top-0 left-0 w-full flex justify-center z-50 pointer-events-none">
          {showError && (
            <div className="bg-white border border-red-300 dark:bg-slate-700 dark:border-orange-500 text-red-600 dark:text-gray-300 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 rounded-md p-4 mt-7 text-center shadow-md transition-opacity duration-500">
              {error}
            </div>
          )}
        </div>

        {/* ✅ Routes */}
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/roles" element={<Users />} />
          <Route path="/:id" element={<Category />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
