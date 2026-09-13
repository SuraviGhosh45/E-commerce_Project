
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiMail } from "react-icons/fi";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const { login } = useAuth();

  // Data passed from Register page
  const email = location.state?.email || "";
  const name = location.state?.name || "Vendora User";

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    // Frontend-only for now
    console.log("OTP:", otp);
    console.log("Email:", email);

    setLoading(true);

    const userData = {
      name: name,
      email: email,
      role: "user",
    };

    login(userData);

    // Simulate successful verification
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setOtp(value);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0B0B0B] px-6 py-12 text-white">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border border-[#292929] bg-[#151515] lg:grid-cols-2">

        {/* Left Branding Section */}
        <div className="relative hidden min-h-[700px] overflow-hidden bg-black p-12 text-white lg:flex lg:flex-col lg:justify-between">

          <div className="relative z-10">
            <Link to="/">
              <img
                src="/vendora_logo_white.png"
                alt="Vendora"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div className="relative z-10">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#C9A227]">
              Almost there
            </p>

            <h1 className="max-w-md text-5xl font-semibold leading-tight">
              Verify your
              <br />
              email.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-gray-400">
              We've sent a verification code to your email address.
              Enter the code to activate your Vendora account.
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#C9A227]/20" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border border-[#C9A227]/10" />

        </div>

        {/* OTP Section */}
        <div className="flex min-h-[700px] items-center justify-center bg-[#151515] p-8 sm:p-12">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-10 lg:hidden">
              <Link to="/">
                <img
                  src="/vendora_logo_white.png"
                  alt="Vendora"
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A227] text-black">
                <FiMail size={21} />
              </div>

              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Verify your email
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Enter the 6-digit verification code sent to
              </p>

              {email && (
                <p className="mt-1 font-medium text-[#C9A227]">
                  {email}
                </p>
              )}

            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* OTP */}
              <div>
                <label
                  htmlFor="otp"
                  className="mb-2 block text-sm font-medium text-gray-200"
                >
                  Verification code
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-4 text-center text-2xl font-semibold tracking-[0.5em] text-white outline-none placeholder:text-gray-600 focus:border-[#C9A227]"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="rounded-lg border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              {/* Verify */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-4 font-medium text-black transition hover:bg-[#E2C45A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify Email"}

                {!loading && <FiArrowRight size={18} />}
              </button>

              {/* Resend */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm font-medium text-gray-400 underline underline-offset-4 transition hover:text-[#C9A227]"
                >
                  Resend OTP
                </button>
              </div>

            </form>

            {/* Login */}
            <div className="mt-8 text-center text-sm text-gray-400">
              Already verified?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#C9A227] underline underline-offset-4 transition hover:text-[#E2C45A]"
              >
                Sign in
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default VerifyOTP;

