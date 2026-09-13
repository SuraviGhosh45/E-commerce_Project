
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend-only for now
    // Later this will call the backend register API.

    navigate("/verify-otp", {
      state: {
        email: formData.email,
        name: formData.name,
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-white px-6 py-12 text-black">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-gray-200 bg-white lg:grid-cols-2">

        {/* Left - Branding */}
        <div className="relative hidden min-h-[700px] overflow-hidden bg-black p-12 text-white lg:flex lg:flex-col lg:justify-between">

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
              Join Vendora
            </p>

            <h1 className="text-5xl font-semibold leading-tight tracking-tight">
              Shopping,
              <br />
              <span className="text-gray-400">redefined.</span>
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

        {/* Right - Register Form */}
        <div className="flex min-h-[700px] items-center justify-center p-6 sm:p-12">
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

            <div className="mb-8">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-gray-500">
                Get started
              </p>

              <h2 className="text-4xl font-semibold tracking-tight">
                Create account.
              </h2>

              <p className="mt-3 text-sm text-gray-500">
                Join Vendora and start your shopping journey.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium"
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
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

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
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
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

                <p className="mt-2 text-xs leading-5 text-gray-400">
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
                  className="mt-1 h-4 w-4 accent-black"
                />

                <label
                  htmlFor="terms"
                  className="text-xs leading-5 text-gray-500"
                >
                  I agree to the{" "}
                  <span className="font-medium text-black">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-black">
                    Privacy Policy
                  </span>
                  .
                </label>
              </div>

              {/* Create Account */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Create account

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

            {/* Login */}
            <p className="mt-8 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-black underline underline-offset-4"
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

