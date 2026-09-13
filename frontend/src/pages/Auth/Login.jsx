
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, loginAsAdmin, loginAsUser } = useAuth();

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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend-only login for now
    const userData = {
      id: "demo-user",
      name: "Suravi",
      email: formData.email,
      role: "user",
    };

    login(userData);

    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[#0B0B0B] px-4 py-6 text-white sm:px-6 sm:py-8 md:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl border border-[#292929] bg-[#151515] shadow-2xl sm:rounded-3xl">

        <div className="grid lg:grid-cols-2">

          {/* ================= LEFT BRANDING ================= */}
          <section className="relative hidden min-h-[720px] overflow-hidden bg-black p-8 sm:p-10 lg:flex lg:flex-col lg:justify-between xl:p-12 2xl:min-h-[800px]">

            {/* Decorative circles */}
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-[#C9A227]/15 sm:-right-32 sm:-top-32 sm:h-80 sm:w-80" />

            <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full border border-[#C9A227]/10 sm:-bottom-40 sm:-left-40 sm:h-96 sm:w-96" />

            {/* Logo */}
            <div className="relative z-10">
              <Link to="/">
                <img
                  src="/vendora_logo_white.png"
                  alt="Vendora"
                  className="h-8 w-auto sm:h-9"
                />
              </Link>
            </div>

            {/* Branding */}
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
                Discover products you'll love, manage your orders, and enjoy a
                seamless shopping experience with Vendora.
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
          <section className="flex min-h-[700px] items-center bg-[#151515] px-5 py-10 sm:px-8 sm:py-12 md:px-12 lg:min-h-[720px] lg:px-10 xl:px-16 2xl:px-20">

            <div className="mx-auto w-full max-w-md">

              {/* Mobile / Tablet Header */}
              <div className="mb-8 flex items-center justify-between sm:mb-10 lg:hidden">

                <Link to="/">
                  <img
                    src="/vendora_logo_white.png"
                    alt="Vendora"
                    className="h-8 w-auto sm:h-9"
                  />
                </Link>

                <Link
                  to="/register"
                  className="text-xs font-medium text-gray-400 transition hover:text-[#C9A227] sm:text-sm"
                >
                  Create account
                </Link>

              </div>

              {/* Heading */}
              <div className="mb-7 sm:mb-8">

                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#C9A227] sm:text-xs sm:tracking-[0.25em]">
                  Account
                </p>

                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Welcome back.
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400 sm:text-base">
                  Sign in to continue to your Vendora account.
                </p>

              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-5"
              >

                {/* Email */}
                <div>

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
                    className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20 sm:py-4"
                  />

                </div>

                {/* Password */}
                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-200"
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

                  <div className="relative">

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 pr-12 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20 sm:py-4"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center p-2 text-gray-500 transition hover:text-[#C9A227] sm:right-4"
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
                <div className="flex items-center gap-3 pt-1">

                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 accent-[#C9A227]"
                  />

                  <label
                    htmlFor="remember"
                    className="text-xs text-gray-400 sm:text-sm"
                  >
                    Remember me
                  </label>

                </div>
                <button
                  type="button"
                  onClick={() => {
                    loginAsAdmin();
                    navigate("/admin/dashboard");
                  }}
                >
                  Test Admin
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsUser();
                    navigate("/");
                  }}
                >
                  Test Customer
                </button>

                {/* Login */}
                <button
                  type="submit"
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A] active:scale-[0.99] sm:py-4"
                >
                  Sign in

                  <FiArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4 sm:my-7">

                <div className="h-px flex-1 bg-[#292929]" />

                <span className="text-[11px] text-gray-600">
                  OR
                </span>

                <div className="h-px flex-1 bg-[#292929]" />

              </div>

              {/* Google */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#292929] bg-[#0B0B0B] px-5 py-3.5 text-sm font-medium text-white transition hover:border-[#C9A227] hover:bg-[#111111] active:scale-[0.99] sm:py-4"
              >
                <FcGoogle size={19} />
                Continue with Google
              </button>

              {/* Register - desktop */}
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
