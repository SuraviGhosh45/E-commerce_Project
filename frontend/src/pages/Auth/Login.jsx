import { useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend login will be connected here
    console.log("Login submitted");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white px-6 py-12 text-black">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white lg:grid-cols-2">

        {/* Left - Branding */}
        <div className="relative hidden min-h-[650px] overflow-hidden bg-black p-12 text-white lg:flex lg:flex-col lg:justify-between">

          {/* Decorative circles */}
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full border border-white/10" />

          <div className="relative z-10">
            <Link to="/">
              <img
                src="/vendora_logo_white.png"
                alt="Vendora"
                className="h-9 w-auto"
              />
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="mb-5 text-sm uppercase tracking-[0.3em] text-gray-400">
              Welcome back
            </p>

            <h1 className="text-5xl font-semibold leading-tight tracking-tight">
              Your world of
              <br />
              <span className="text-gray-400">better shopping.</span>
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
              Discover products you'll love, manage your orders, and enjoy a
              seamless shopping experience with Vendora.
            </p>
          </div>

          <p className="relative z-10 text-xs text-gray-500">
            © 2026 Vendora. All rights reserved.
          </p>
        </div>

        {/* Right - Login Form */}
        <div className="flex min-h-[650px] items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-10 lg:hidden">
              <Link to="/">
                <img
                  src="/vendora_logo_black.png"
                  alt="Vendora"
                  className="h-9 w-auto"
                />
              </Link>
            </div>

            <div className="mb-10">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gray-500">
                Account
              </p>

              <h2 className="text-4xl font-semibold tracking-tight">
                Welcome back.
              </h2>

              <p className="mt-3 text-sm text-gray-500">
                Sign in to continue to your Vendora account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs text-gray-500 transition hover:text-black"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-black"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Sign in

                <FiArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">OR</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 px-5 py-3.5 text-sm font-medium transition hover:border-black hover:bg-gray-50"
            >
              <FcGoogle size={19} />
              Continue with Google
            </button>

            {/* Register */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-black underline underline-offset-4"
              >
                Create one
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

