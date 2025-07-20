import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ArrowRightLeft } from "lucide-react";
import logo from "../../assets/Logo.png";
import { useDispatch, useSelector } from "react-redux";

import { toggleMode } from "../../redux/slices/uiSlice";
import {resetUserState} from "../../redux/reducers/authSlice";


function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = useSelector((state) => state.ui?.mode || "light");
  const userType = useSelector((state) => state.user.userType);

  const [isOpen, setIsOpen] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(true);

  const handleLogout = () => {
    dispatch(resetUserState()); // ✅ correct action
    localStorage.clear();
    navigate("/login");
  };

  const toggleNavbar = () => setIsOpen(!isOpen);
  const toggleRoute = () => {
    setIsAdminRoute(!isAdminRoute);
    navigate(isAdminRoute ? "/" : "/admin");
  };

  const colors =
    mode === "light"
      ? {
          primary: "#2563eb",
          secondary: "#4f46e5",
          accent: "#0ea5e9",
          background: "#f9fafb",
          text: "#1f2937",
        }
      : {
          primary: "#3b82f6",
          secondary: "#8b5cf6",
          accent: "#06b6d4",
          background: "#111827",
          text: "#f3f4f6",
        };

  return (
    <div>
      <div
        className="top-0 left-0 w-full shadow-md z-50 transition duration-500"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.text,
        }}
      >
        <nav>
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen p-4">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logo} className="h-8" alt="CodeNest SDE Logo" />
              <span
                className="text-2xl font-mono font-semibold"
                style={{ color: colors.primary }}
              >
                CodeNest SDE
              </span>
            </Link>

            {localStorage.getItem("userName") && (
              <div
                className="hidden md:block mx-2 text-xl font-mono font-semibold"
                style={{
                  background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Welcome {localStorage.getItem("userName")}
              </div>
            )}

            <div className="hidden sm:flex items-center">
              {/* Mode Toggle */}
              <button
                onClick={() => dispatch(toggleMode())}
                className="p-2 mr-2 rounded-full hover:bg-opacity-20 transition-colors"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                }}
                title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
              />

              {["Admin", "Super Admin"].includes(userType) && (
                <button
                  onClick={toggleRoute}
                  className="mx-2 hover:scale-110 transition-transform"
                  style={{ color: colors.text }}
                  title={`Switch to ${isAdminRoute ? "User" : "Admin"} mode`}
                >
                  <ArrowRightLeft />
                </button>
              )}

              {!localStorage.getItem("token") ? (
                <>
                  <Link
                    to="/login"
                    className="font-bold text-sm py-1.5 px-3 rounded mx-2"
                    style={{ backgroundColor: colors.primary, color: "#fff" }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="font-bold text-sm py-1.5 px-3 ml-2 rounded"
                    style={{ backgroundColor: colors.secondary, color: "#fff" }}
                  >
                    Signup
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="font-bold text-sm py-1.5 px-3 rounded mx-2"
                  style={{ backgroundColor: colors.accent, color: "#fff" }}
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile */}
            <div className="flex w-[75px] justify-end sm:hidden">
              <button
                onClick={() => dispatch(toggleMode())}
                className="mr-4 text-lg"
                title="Toggle Mode"
                style={{ color: colors.text }}
              />
              <button onClick={toggleNavbar} style={{ color: colors.text }}>
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="flex flex-col items-center w-full font-semibold font-mono"
            style={{ backgroundColor: colors.background, color: colors.text }}
          >
            {!localStorage.getItem("token") ? (
              <>
                <Link to="/login" className="py-2 w-full text-center hover:opacity-80">
                  Login
                </Link>
                <Link to="/signup" className="py-2 w-full text-center hover:opacity-80">
                  Signup
                </Link>
              </>
            ) : (
              <>
                {["Admin", "Super Admin"].includes(userType) && (
                  <button
                    onClick={toggleRoute}
                    className="py-2 w-full text-center hover:opacity-80"
                  >
                    Switch to {isAdminRoute ? "User" : "Admin"}
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="py-2 w-full text-center hover:opacity-80"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}

        {/* Guest Banner */}
        {userType === "Guest" && (
          <>
            <div
              className="md:hidden text-center p-2"
              style={{ backgroundColor: `${colors.primary}20`, color: colors.text }}
            >
              <Link to="/login" className="text-sm font-semibold">
                Login to access all features
              </Link>
            </div>
            <div
              className="hidden md:flex h-8 items-center justify-center"
              style={{ backgroundColor: `${colors.primary}20`, color: colors.text }}
            >
              <Link to="/login" className="text-xs font-semibold">
                Login to access all features
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NavBar;
