
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

    navigate("/verify-otp", {
      state: {
        email: formData.email,
        name: formData.name,
      },
    });
  };

  return (
    <main className="min-h-screen bg-[#0B0B0B] px-4 py-6 text-white sm:px-6 sm:py-8 md:py-10 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl border border-[#292929] bg-[#151515] shadow-2xl sm:rounded-3xl">

        <div className="grid lg:grid-cols-2">

          {/* ================= LEFT BRANDING ================= */}
          <section className="relative hidden min-h-[760px] overflow-hidden bg-black p-8 sm:p-10 lg:flex lg:flex-col lg:justify-between xl:p-12 2xl:min-h-[820px]">

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

            {/* Branding content */}
            <div className="relative z-10 max-w-xl">

              <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:mb-5 sm:text-sm sm:tracking-[0.3em]">
                Join Vendora
              </p>

              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
                Shopping,
                <br />
                <span className="text-[#C9A227]">
                  redefined.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-gray-400 sm:mt-6 sm:text-base">
                Create your account and discover a smarter, simpler way to shop
                your favorite products.
              </p>

              <div className="mt-7 space-y-3 text-sm text-gray-300 sm:mt-8">

                <p>
                  <span className="text-[#C9A227]">✓</span>{" "}
                  Personalized shopping experience
                </p>

                <p>
                  <span className="text-[#C9A227]">✓</span>{" "}
                  Easy order tracking
                </p>

                <p>
                  <span className="text-[#C9A227]">✓</span>{" "}
                  Secure checkout
                </p>

              </div>

            </div>

            <p className="relative z-10 text-xs text-gray-500">
              © 2026 Vendora. All rights reserved.
            </p>
          </section>

          {/* ================= FORM SECTION ================= */}
          <section className="flex min-h-[720px] items-center bg-[#151515] px-5 py-10 sm:px-8 sm:py-12 md:px-12 lg:min-h-[760px] lg:px-10 xl:px-16 2xl:px-20">

            <div className="mx-auto w-full max-w-md">

              {/* Mobile / Tablet Logo */}
              <div className="mb-8 flex items-center justify-between sm:mb-10 lg:hidden">

                <Link to="/">
                  <img
                    src="/vendora_logo_white.png"
                    alt="Vendora"
                    className="h-8 w-auto sm:h-9"
                  />
                </Link>

                <Link
                  to="/login"
                  className="text-xs font-medium text-gray-400 transition hover:text-[#C9A227] sm:text-sm"
                >
                  Sign in
                </Link>

              </div>

              {/* Heading */}
              <div className="mb-7 sm:mb-8">

                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#C9A227] sm:text-xs sm:tracking-[0.25em]">
                  Get started
                </p>

                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Create account.
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400 sm:text-base">
                  Join Vendora and start your shopping journey.
                </p>

              </div>

              {/* Form */}
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
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20 sm:py-4"
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
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20 sm:py-4"
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
                      autoComplete="new-password"
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

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    Minimum 8 characters with uppercase, lowercase, number and
                    special character.
                  </p>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 pt-1">

                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 shrink-0 accent-[#C9A227]"
                  />

                  <label
                    htmlFor="terms"
                    className="text-xs leading-5 text-gray-400"
                  >
                    I agree to the{" "}
                    <button
                      type="button"
                      className="font-medium text-[#C9A227] transition hover:text-[#E2C45A]"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="font-medium text-[#C9A227] transition hover:text-[#E2C45A]"
                    >
                      Privacy Policy
                    </button>
                    .
                  </label>

                </div>

                {/* Create Account */}
                <button
                  type="submit"
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A] active:scale-[0.99] sm:py-4"
                >
                  Create account

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

              {/* Desktop login */}
              <p className="mt-7 hidden text-center text-sm text-gray-400 lg:block">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-medium text-[#C9A227] underline underline-offset-4 transition hover:text-[#E2C45A]"
                >
                  Sign in
                </Link>

              </p>

            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Register;

