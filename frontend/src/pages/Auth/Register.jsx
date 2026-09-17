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
    <div className="min-h-screen bg-[#0B0B0B] px-4 py-8 text-white sm:px-6 sm:py-12">

      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-[#292929] bg-[#151515] lg:grid-cols-2">

        {/* LEFT */}
        <div className="relative hidden min-h-[700px] overflow-hidden bg-black p-8 text-white lg:flex lg:flex-col lg:justify-between lg:p-12">

          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border border-[#C9A227]/10" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full border border-[#C9A227]/10" />

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
            <p className="mb-5 text-sm uppercase tracking-[0.3em] text-[#C9A227]">
              Join Vendora
            </p>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Shopping,
              <br />
              <span className="text-gray-500">
                redefined.
              </span>
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
              Create your account and discover a smarter, simpler way to shop
              your favorite products.
            </p>

            <div className="mt-8 space-y-3 text-sm text-gray-300">
              <p>✓ Personalized shopping experience</p>
              <p>✓ Easy order tracking</p>
              <p>✓ Secure checkout</p>
            </div>
          </div>

          <p className="relative z-10 text-xs text-gray-500">
            © 2026 Vendora. All rights reserved.
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex min-h-[700px] items-center justify-center p-5 sm:p-8 md:p-12">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="mb-8 lg:hidden">
              <Link to="/">
                <img
                  src="/vendora_logo_white.png"
                  alt="Vendora"
                  className="h-9 w-auto"
                />
              </Link>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-[#C9A227]">
                Get started
              </p>

              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Create account.
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Join Vendora and start your shopping journey.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
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
                  className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
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
                  className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
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
                    className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 pr-12 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#C9A227]"
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
                  className="mt-1 h-4 w-4 accent-[#C9A227]"
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
                <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A] disabled:cursor-not-allowed disabled:opacity-60"
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
            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-[#C9A227] underline underline-offset-4"
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
