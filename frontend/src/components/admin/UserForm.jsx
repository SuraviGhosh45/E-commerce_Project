
import { useState } from "react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiShield,
  FiSave,
  FiX,
} from "react-icons/fi";

const UserForm = ({
  initialData = null,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    role: initialData?.role || "user",
  });

  const roles = ["user", "admin"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7"
    >
      {/* Header */}
      <div className="border-b border-[#292929] pb-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227] sm:text-xs">
          {initialData ? "Edit User" : "New User"}
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
          {initialData
            ? "Update user information"
            : "Create a new user"}
        </h2>

        <p className="mt-2 text-xs leading-6 text-gray-500 sm:text-sm">
          Add user details and assign the appropriate role.
        </p>
      </div>

      {/* Form */}
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
              placeholder="Enter full name"
              autoComplete="name"
              required
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
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
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-200"
          >
            {initialData ? "New password" : "Password"}
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
              placeholder={
                initialData
                  ? "Leave blank to keep current password"
                  : "Create a password"
              }
              autoComplete="new-password"
              required={!initialData}
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
            />
          </div>

          <p className="mt-2 text-xs text-gray-600">
            Use a strong password with uppercase, lowercase, number and
            special character.
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
              className="w-full appearance-none rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-gray-200 outline-none transition focus:border-[#C9A227]"
            >
              {roles.map((role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role === "admin" ? "Administrator" : "Customer"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Role info */}
        <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-4">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#151515] text-[#C9A227]">
              <FiShield size={16} />
            </div>

            <div>
              <p className="text-xs font-medium text-gray-200">
                Role access
              </p>

              <p className="mt-1 text-[11px] leading-5 text-gray-600">
                Administrators can manage products, orders, users and
                analytics. Customers have access to shopping and order
                features.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#292929] pt-6 sm:flex-row sm:justify-end">

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#292929] px-5 py-3.5 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
          >
            <FiX size={16} />
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
        >
          <FiSave size={17} />

          {initialData
            ? "Update User"
            : "Create User"}
        </button>

      </div>
    </form>
  );
};

export default UserForm;
