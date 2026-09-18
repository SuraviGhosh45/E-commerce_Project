import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiEdit2,
  FiMail,
  FiShield,
  FiUser,
  FiLogOut,
  FiSave,
  FiX,
  FiShoppingBag,
  FiPackage,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Profile = () => {
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
    updateUser,
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // Keep form data synchronized with the authenticated user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // User is not logged in
  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] px-5 py-20 text-[#F5F5F5] sm:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#292929] bg-[#151515] p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
            <FiUser size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-semibold sm:text-3xl">
            Login required
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-500">
            Please sign in to view your profile and account information.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-[#C9A227] px-6 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl border border-[#C9A227] px-6 py-3.5 text-sm font-medium text-[#C9A227] transition hover:bg-[#C9A227] hover:text-black"
            >
              Create Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear messages when the user starts editing
    setError("");
    setSuccess("");
  };

  const handleEdit = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
    });

    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
    });

    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();

    // Frontend validation
    if (!name) {
      setError("Name cannot be empty.");
      return;
    }

    if (!email) {
      setError("Email cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put("/auth/profile", {
        name,
        email,
      });

      const updatedUser = response.data?.user;

      if (!updatedUser) {
        throw new Error(
          "Updated user data was not returned."
        );
      }

      // Update React state + localStorage
      updateUser(updatedUser);

      // Keep form synchronized with database response
      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
      });

      setIsEditing(false);

      setSuccess(
        response.data?.message ||
          "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "UPDATE PROFILE ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isAdmin = user.role === "admin";

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
      {/* ================= HEADER ================= */}
      <section className="border-b border-[#292929] bg-black">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10 xl:px-12">
          <Link
            to={isAdmin ? "/admin/dashboard" : "/"}
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#C9A227]"
          >
            <FiArrowLeft size={16} />

            {isAdmin
              ? "Back to Dashboard"
              : "Back to Home"}
          </Link>

          <div className="mt-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-sm">
              Account
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
              Manage your account information and view
              your Vendora profile.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 xl:px-12">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* ================= PROFILE CARD ================= */}
          <aside className="h-fit rounded-2xl border border-[#292929] bg-[#151515] p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#C9A227] text-3xl font-semibold text-black shadow-[0_0_35px_rgba(201,162,39,0.12)]">
                {(user.name || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <h2 className="mt-5 text-xl font-semibold text-white">
                {user.name || "User"}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {user.email}
              </p>

              {/* Role */}
              <span
                className={`mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  isAdmin
                    ? "border-[#C9A227]/30 bg-[#C9A227]/10 text-[#E2C45A]"
                    : "border-[#292929] bg-[#0B0B0B] text-gray-400"
                }`}
              >
                <FiShield size={13} />

                {isAdmin
                  ? "Administrator"
                  : "Customer"}
              </span>
            </div>

            {/* Quick links */}
            <div className="mt-7 border-t border-[#292929] pt-6">
              {!isAdmin && (
                <>
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-[#0B0B0B] hover:text-[#C9A227]"
                  >
                    <FiPackage size={17} />
                    My Orders
                  </Link>

                  <Link
                    to="/shop"
                    className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-[#0B0B0B] hover:text-[#C9A227]"
                  >
                    <FiShoppingBag size={17} />
                    Continue Shopping
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-[#0B0B0B] hover:text-[#C9A227]"
                  >
                    <FiPackage size={17} />
                    Admin Dashboard
                  </Link>

                  <Link
                    to="/admin/analytics"
                    className="mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-[#0B0B0B] hover:text-[#C9A227]"
                  >
                    <FiShoppingBag size={17} />
                    Analytics
                  </Link>
                </>
              )}
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#292929] px-4 py-3.5 text-sm font-medium text-gray-400 transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-400"
            >
              <FiLogOut size={17} />
              Logout
            </button>
          </aside>

          {/* ================= PROFILE DETAILS ================= */}
          <div className="space-y-6">
            {/* Personal information */}
            <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">
              <div className="flex flex-col gap-4 border-b border-[#292929] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227]">
                    Personal Information
                  </p>

                  <h2 className="mt-2 text-lg font-semibold">
                    Account details
                  </h2>

                  <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                    Your current account information.
                  </p>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="flex w-fit items-center gap-2 rounded-xl border border-[#292929] px-4 py-2.5 text-sm text-gray-400 transition hover:border-[#C9A227] hover:text-[#C9A227]"
                  >
                    <FiEdit2 size={15} />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Success message */}
              {success && (
                <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  {success}
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {!isEditing ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiUser size={15} />

                      <p className="text-[10px] uppercase tracking-wider">
                        Full Name
                      </p>
                    </div>

                    <p className="mt-3 text-sm font-medium text-gray-200">
                      {user.name || "Not provided"}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMail size={15} />

                      <p className="text-[10px] uppercase tracking-wider">
                        Email Address
                      </p>
                    </div>

                    <p className="mt-3 break-all text-sm font-medium text-gray-200">
                      {user.email || "Not provided"}
                    </p>
                  </div>

                  {/* Role */}
                  <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiShield size={15} />

                      <p className="text-[10px] uppercase tracking-wider">
                        Account Role
                      </p>
                    </div>

                    <p className="mt-3 text-sm font-medium capitalize text-[#C9A227]">
                      {user.role || "user"}
                    </p>
                  </div>

                  {/* Account status */}
                  <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="h-2 w-2 rounded-full bg-green-500" />

                      <p className="text-[10px] uppercase tracking-wider">
                        Account Status
                      </p>
                    </div>

                    <p className="mt-3 text-sm font-medium text-green-400">
                      Active
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-200"
                    >
                      Full name
                    </label>

                    <div className="relative">
                      <FiUser
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                      />

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={saving}
                        className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#C9A227] disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-200"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <FiMail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={saving}
                        className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#C9A227] disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col-reverse gap-3 border-t border-[#292929] pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 rounded-xl border border-[#292929] px-5 py-3.5 text-sm font-medium text-gray-300 transition hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiX size={16} />
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiSave size={16} />

                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Future features */}
            <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227]">
                Account Security
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Security settings
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Password management and other
                account-security features will be connected
                to the backend later.
              </p>

              <button
                type="button"
                disabled
                className="mt-5 cursor-not-allowed rounded-xl border border-[#292929] px-5 py-3 text-sm text-gray-600"
              >
                Change Password
              </button>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;