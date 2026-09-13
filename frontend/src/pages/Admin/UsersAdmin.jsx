import { useMemo, useState } from "react";
import {
  FiEdit2,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

import DataTable from "../../components/admin/DataTable";
import UserForm from "../../components/admin/UserForm";

const UserAdmin = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Suravi Ghosh",
      email: "suravi@example.com",
      role: "user",
    },
    {
      id: 2,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      role: "user",
    },
    {
      id: 3,
      name: "Ananya Das",
      email: "ananya@example.com",
      role: "user",
    },
    {
      id: 4,
      name: "Admin User",
      email: "admin@vendora.com",
      role: "admin",
    },
    {
      id: 5,
      name: "Arjun Roy",
      email: "arjun@example.com",
      role: "user",
    },
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const roles = ["All", "user", "admin"];

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleCreateUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
    };

    setUsers((currentUsers) => [
      ...currentUsers,
      newUser,
    ]);

    setShowForm(false);
  };

  const handleUpdateUser = (userData) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              ...userData,
            }
          : user
      )
    );

    setEditingUser(null);
    setShowForm(false);
  };

  const handleDeleteUser = (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== userId)
    );
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("All");
  };

  const columns = [
    {
      key: "name",
      label: "User",
      render: (user) => (
        <div className="flex min-w-[220px] items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C9A227] text-sm font-semibold text-black">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium text-white">
              {user.name}
            </p>

            <p className="mt-1 text-xs text-gray-600">
              ID #{user.id}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (user) => (
        <span className="text-gray-400">
          {user.email}
        </span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (user) => (
        <span
          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${
            user.role === "admin"
              ? "border-[#C9A227]/30 bg-[#C9A227]/10 text-[#E2C45A]"
              : "border-[#292929] bg-[#111111] text-gray-400"
          }`}
        >
          {user.role === "admin" ? "Administrator" : "Customer"}
        </span>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#0B0B0B] px-4 py-6 text-[#F5F5F5] sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-xs">
          Administration
        </p>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              User Management
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Manage customers, administrators and access roles.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
            className="flex w-fit items-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
          >
            <FiPlus size={17} />
            Add User
          </button>

        </div>
      </div>

      {/* Form */}
      {showForm && (
        <section className="mb-6">
          <UserForm
            initialData={editingUser}
            onSubmit={
              editingUser
                ? handleUpdateUser
                : handleCreateUser
            }
            onCancel={handleCancelForm}
          />
        </section>
      )}

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Total Users
          </p>

          <p className="mt-3 text-2xl font-semibold">
            {users.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Customers
          </p>

          <p className="mt-3 text-2xl font-semibold text-[#C9A227]">
            {
              users.filter((user) => user.role === "user")
                .length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Administrators
          </p>

          <p className="mt-3 text-2xl font-semibold text-[#E2C45A]">
            {
              users.filter((user) => user.role === "admin")
                .length
            }
          </p>
        </div>

      </section>

      {/* Filters */}
      <section className="mt-6 rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}
          <div className="relative w-full lg:max-w-md">

            <FiSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email..."
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227]"
            />

          </div>

          {/* Role + Reset */}
          <div className="flex flex-col gap-3 sm:flex-row">

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-gray-300 outline-none transition focus:border-[#C9A227]"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === "All"
                    ? "All Roles"
                    : role === "admin"
                      ? "Administrators"
                      : "Customers"}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#292929] px-4 py-3.5 text-sm text-gray-400 transition hover:border-[#C9A227] hover:text-[#C9A227]"
            >
              <FiRefreshCw size={15} />
              Reset
            </button>

          </div>

        </div>
      </section>

      {/* Table */}
      <section className="mt-6">

        <DataTable
          columns={columns}
          data={filteredUsers}
          emptyMessage="No users match your filters."
          actions={(user) => (
            <>
              <button
                type="button"
                onClick={() => handleEdit(user)}
                title="Edit user"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#292929] text-gray-400 transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-black"
              >
                <FiEdit2 size={15} />
              </button>

              <button
                type="button"
                onClick={() => handleDeleteUser(user.id)}
                title="Delete user"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#292929] text-gray-400 transition hover:border-red-500 hover:bg-red-500 hover:text-white"
              >
                <FiTrash2 size={15} />
              </button>
            </>
          )}
        />

      </section>

    </main>
  );
};

export default UserAdmin;
