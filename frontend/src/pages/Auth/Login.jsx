import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      const responseUser =
        response.data?.user || response.data;

      const token =
        response.data?.token ||
        response.data?.user?.token;

      if (!token) {
        console.error(
          "LOGIN RESPONSE DOES NOT CONTAIN TOKEN:",
          response.data
        );

        throw new Error(
          "Login successful, but no authentication token was returned by the server."
        );
      }

      const userData = {
        id:
          responseUser?._id ||
          responseUser?.id ||
          "",

        name: responseUser?.name || "",

        email:
          responseUser?.email ||
          formData.email.trim().toLowerCase(),

        role: responseUser?.role || "user",

        token,
      };

      console.log("USER DATA SAVED:", {
        ...userData,
        token: userData.token
          ? "TOKEN_PRESENT"
          : "NO_TOKEN",
      });

      login(userData);

      const storedUser =
        localStorage.getItem("vendora_user");

      console.log(
        "STORED USER:",
        storedUser
          ? JSON.parse(storedUser)
          : null
      );

      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");

    try {
      setLoading(true);

      const credential = credentialResponse?.credential;

      if (!credential) {
        throw new Error("Google credential was not received.");
      }

      const response = await api.post("/auth/google", {
        credential,
      });

      console.log("GOOGLE LOGIN RESPONSE:", response.data);

      const responseUser = response.data?.user;
      const token = response.data?.token;

      if (!responseUser || !token) {
        throw new Error(
          "Google login succeeded, but authentication data was not returned."
        );
      }

      const userData = {
        id: responseUser._id || responseUser.id || "",
        name: responseUser.name || "",
        email: responseUser.email || "",
        role: responseUser.role || "user",
        token,
        isVerified: responseUser.isVerified ?? true,
      };

      login(userData);

      console.log("GOOGLE USER SAVED:", {
        ...userData,
        token: userData.token
          ? "TOKEN_PRESENT"
          : "NO_TOKEN",
      });

      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("GOOGLE LOGIN ERROR:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Google login failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google Sign-In failed");
    setError("Google Sign-In failed. Please try again.");
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#0B0B0B] px-3 py-4 text-white sm:px-5 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">

      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-xl border border-[#292929] bg-[#151515] shadow-2xl sm:rounded-2xl md:rounded-3xl">

        <div className="grid min-w-0 lg:grid-cols-2">

          {/* ================= LEFT BRANDING ================= */}
          <section className="relative hidden min-h-[720px] overflow-hidden bg-black p-8 sm:p-10 lg:flex lg:flex-col lg:justify-between xl:p-12 2xl:min-h-[800px]">

            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-[#C9A227]/15 sm:-right-32 sm:-top-32 sm:h-80 sm:w-80" />

            <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full border border-[#C9A227]/10 sm:-bottom-40 sm:-left-40 sm:h-96 sm:w-96" />

            <div className="relative z-10">
              <Link to="/">
                <img
                  src="/vendora_logo_black.png"
                  alt="Vendora"
                  className="h-8 w-auto sm:h-9"
                />
              </Link>
            </div>

            <div className="relative z-10 max-w-xl">

              <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:mb-5 sm:text-sm sm:tracking-[0.3em]">
                Welcome back
              </p>

              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
                Your world of
                <br />
                <span className="text-[#C9A227]">
                  better shopping.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-gray-400 sm:mt-6 sm:text-base">
                Discover products you'll love, manage
                your orders, and enjoy a seamless
                shopping experience with Vendora.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:mt-10">

                <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-4">
                  <p className="text-xl font-semibold text-[#C9A227]">
                    10K+
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Products
                  </p>
                </div>

                <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-4">
                  <p className="text-xl font-semibold text-[#C9A227]">
                    5K+
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Customers
                  </p>
                </div>

              </div>
            </div>

            <p className="relative z-10 text-xs text-gray-500">
              © 2026 Vendora. All rights reserved.
            </p>

          </section>

          {/* ================= LOGIN FORM ================= */}
          <section className="flex min-w-0 min-h-[calc(100vh-2rem)] items-center bg-[#151515] px-4 py-8 sm:min-h-[700px] sm:px-8 sm:py-10 md:px-10 md:py-12 lg:min-h-[720px] lg:px-10 xl:px-16 2xl:px-20">

            <div className="mx-auto w-full min-w-0 max-w-md">

              {/* Mobile Header */}
              <div className="mb-7 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-3 sm:mb-9 lg:hidden">

                <Link
                  to="/"
                  className="shrink-0"
                >
                  <img
                    src="/vendora_logo_black.png"
                    alt="Vendora"
                    className="h-7 w-auto sm:h-8"
                  />
                </Link>

                <Link
                  to="/register"
                  className="ml-auto max-w-full text-right text-xs font-medium text-gray-400 transition hover:text-[#C9A227] sm:text-sm"
                >
                  Create account
                </Link>

              </div>

              {/* Heading */}
              <div className="mb-7 min-w-0 sm:mb-8">

                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-[#C9A227] sm:mb-3 sm:text-xs sm:tracking-[0.25em]">
                  Account
                </p>

                <h2 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                  Welcome back.
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-400 sm:mt-3 sm:text-base">
                  Sign in to continue to your Vendora
                  account.
                </p>

              </div>

              <form
                onSubmit={handleSubmit}
                className="w-full min-w-0 space-y-4 sm:space-y-5"
              >

                {/* Email */}
                <div className="min-w-0">

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-200"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    disabled={loading}
                    className="block w-full min-w-0 rounded-xl border border-[#292929] bg-[#0B0B0B] px-3.5 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20 disabled:opacity-60 sm:px-4 sm:py-4"
                  />

                </div>

                {/* Password */}
                <div className="min-w-0">

                  <div className="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">

                    <label
                      htmlFor="password"
                      className="block shrink-0 text-sm font-medium text-gray-200"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs text-gray-500 transition hover:text-[#C9A227]"
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <div className="relative min-w-0">

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                      disabled={loading}
                      className="block w-full min-w-0 rounded-xl border border-[#292929] bg-[#0B0B0B] px-3.5 py-3.5 pr-12 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20 disabled:opacity-60 sm:px-4 sm:py-4"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center p-2 text-gray-500 transition hover:text-[#C9A227] sm:right-3"
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>

                  </div>

                </div>

                {/* Remember me */}
                <div className="flex w-full items-center gap-3 pt-1">

                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 shrink-0 accent-[#C9A227]"
                  />

                  <label
                    htmlFor="remember"
                    className="text-xs text-gray-400 sm:text-sm"
                  >
                    Remember me
                  </label>

                </div>

                {/* Error */}
                {error && (
                  <div className="w-full break-words rounded-xl border border-red-900/40 bg-red-950/30 px-3.5 py-3 text-sm leading-5 text-red-400 sm:px-4">
                    {error}
                  </div>
                )}

                {/* Login */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
                >
                  {loading
                    ? "Signing in..."
                    : "Sign in"}

                  {!loading && (
                    <FiArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>

              </form>

              {/* Divider */}
              <div className="my-6 flex w-full items-center gap-3 sm:my-7 sm:gap-4">

                <div className="h-px min-w-0 flex-1 bg-[#292929]" />

                <span className="shrink-0 text-[10px] text-gray-600 sm:text-[11px]">
                  OR
                </span>

                <div className="h-px min-w-0 flex-1 bg-[#292929]" />

              </div>

              {/* Google */}
              <div className="w-full min-w-0 overflow-hidden rounded-xl">

                <div className="flex w-full min-w-0 justify-center overflow-hidden">

                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_black"
                    size="large"
                    text="continue_with"
                    shape="rectangular"
                    width="400"
                  />

                </div>

              </div>

              {/* Register */}
              <p className="mt-7 hidden text-center text-sm text-gray-400 lg:block">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-[#C9A227] underline underline-offset-4 transition hover:text-[#E2C45A]"
                >
                  Create one
                </Link>
              </p>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
};

export default Login;