import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiShield,
  FiSave,
  FiX,
  FiLoader,
} from "react-icons/fi";

const UserForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [formError, setFormError] = useState("");

  const roles = ["user", "admin"];

  // --------------------------------------------------
  // LOAD USER DATA
  // --------------------------------------------------
  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      role: initialData?.role || "user",
    });

    setFormError("");
  }, [initialData]);

  // --------------------------------------------------
  // HANDLE INPUT
  // --------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password.trim();

    if (!name) {
      setFormError("Name is required.");
      return;
    }

    if (!email) {
      setFormError("Email is required.");
      return;
    }

    if (!formData.role) {
      setFormError("Please select a role.");
      return;
    }

    // Password is optional during edit.
    // If entered, it must satisfy the minimum length.
    if (password && password.length < 8) {
      setFormError(
        "New password must be at least 8 characters."
      );
      return;
    }

    const updatedData = {
      name,
      email,
      role: formData.role,
    };

    // Only send password when the admin entered one.
    if (password) {
      updatedData.password = password;
    }

    try {
      setFormError("");
      await onSubmit?.(updatedData);
    } catch (error) {
      console.error("USER FORM SUBMIT ERROR:", error);

      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update user."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7"
    >
      {/* Header */}
      <div className="border-b border-[#292929] pb-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227] sm:text-xs">
          Edit User
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
          Update user information
        </h2>

        <p className="mt-2 text-xs leading-6 text-gray-500 sm:text-sm">
          Update the user's details, password or access role.
        </p>
      </div>

      {/* Error */}
      {formError && (
        <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {formError}
        </div>
      )}

      <div className="mt-7 space-y-6">
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
              disabled={loading}
              required
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] disabled:cursor-not-allowed disabled:opacity-50"
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
              disabled={loading}
              required
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-200"
          >
            New password
          </label>

          <div className="relative">
            <FiLock
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
            />

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
              minLength={8}
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <p className="mt-2 text-xs text-gray-600">
            Leave this field empty to keep the existing password.
          </p>
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="role"
            className="mb-2 block text-sm font-medium text-gray-200"
          >
            User role
          </label>

          <div className="relative">
            <FiShield
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
            />

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className="w-full appearance-none rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-gray-200 outline-none transition focus:border-[#C9A227] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === "admin"
                    ? "Administrator"
                    : "Customer"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#292929] pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#292929] px-5 py-3.5 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiX size={16} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <FiLoader
                size={17}
                className="animate-spin"
              />
              Updating...
            </>
          ) : (
            <>
              <FiSave size={17} />
              Update User
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default UserForm;