import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Registration response:", response.data);

      // Go to OTP only after successful registration
      navigate("/verify-otp", {
        state: {
          email: formData.email,
          name: formData.name,
        },
      });
    } catch (err) {
      console.error("Registration error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] px-3 py-4 text-white sm:px-5 sm:py-6 md:px-6 md:py-8 lg:px-8 lg:py-12">

      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-xl border border-[#292929] bg-[#151515] sm:rounded-2xl lg:grid-cols-2 lg:rounded-3xl">

        {/* ================= LEFT ================= */}
        <div className="relative hidden min-h-[700px] overflow-hidden bg-black p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">

          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border border-[#C9A227]/10" />

          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full border border-[#C9A227]/10" />

          <div className="relative z-10">
            <Link to="/">
              <img
                src="/vendora_logo_black.png"
                alt="Vendora"
                className="h-8 w-auto xl:h-9"
              />
            </Link>
          </div>

          <div className="relative z-10 max-w-md">

            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#C9A227] xl:mb-5 xl:text-sm xl:tracking-[0.3em]">
              Join Vendora
            </p>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Shopping,
              <br />
              <span className="text-gray-500">
                redefined.
              </span>
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400 xl:mt-6">
              Create your account and discover a smarter, simpler way to shop
              your favorite products.
            </p>

            <div className="mt-7 space-y-3 text-sm text-gray-300 xl:mt-8">
              <p>✓ Personalized shopping experience</p>
              <p>✓ Easy order tracking</p>
              <p>✓ Secure checkout</p>
            </div>
          </div>

          <p className="relative z-10 text-xs text-gray-500">
            © 2026 Vendora. All rights reserved.
          </p>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center px-4 py-8 sm:min-h-[700px] sm:px-8 sm:py-10 md:px-10 md:py-12 lg:min-h-[720px] lg:px-10 xl:px-16">

          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="mb-7 flex items-center justify-between lg:hidden sm:mb-9">
              <Link to="/" className="shrink-0">
                <img
                  src="/vendora_logo_black.png"
                  alt="Vendora"
                  className="h-7 w-auto sm:h-8"
                />
              </Link>

              <Link
                to="/login"
                className="text-right text-xs font-medium text-gray-400 transition hover:text-[#C9A227] sm:text-sm"
              >
                Sign in
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-7 sm:mb-8">

              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-[#C9A227] sm:mb-3 sm:text-xs sm:tracking-[0.25em]">
                Get started
              </p>

              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                Create account.
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500 sm:mt-3">
                Join Vendora and start your shopping journey.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-5"
            >

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-200"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-3.5 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20 disabled:opacity-60 sm:px-4 sm:py-4"
                />
              </div>

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
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-3.5 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20 disabled:opacity-60 sm:px-4 sm:py-4"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-200"
                >
                  Password
                </label>

                <div className="relative">

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-3.5 py-3.5 pr-12 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20 disabled:opacity-60 sm:px-4 sm:py-4"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center p-2 text-gray-500 transition hover:text-[#C9A227] sm:right-3"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>

                </div>

                <p className="mt-2 text-xs leading-5 text-gray-600">
                  Minimum 8 characters with uppercase, lowercase, number and
                  special character.
                </p>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">

                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 shrink-0 accent-[#C9A227]"
                />

                <label
                  htmlFor="terms"
                  className="text-xs leading-5 text-gray-500"
                >
                  I agree to the{" "}
                  <span className="font-medium text-gray-200">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-gray-200">
                    Privacy Policy
                  </span>
                  .
                </label>

              </div>

              {/* Error */}
              {error && (
                <div className="break-words rounded-xl border border-red-900/50 bg-red-950/20 px-3.5 py-3 text-sm leading-5 text-red-400 sm:px-4">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
              >
                {loading ? "Creating account..." : "Create account"}

                {!loading && (
                  <FiArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

            </form>

            {/* Login */}
            <p className="mt-7 text-center text-xs text-gray-500 sm:mt-8 sm:text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-[#C9A227] underline underline-offset-4 transition hover:text-[#E2C45A]"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;