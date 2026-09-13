
import { FiBell, FiChevronDown, FiMenu } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const AdminHeader = ({ title = "Dashboard", onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-[#292929] bg-[#0B0B0B]/95 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">

          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#292929] text-gray-300 transition hover:border-[#C9A227] hover:text-[#C9A227] lg:hidden"
            aria-label="Open admin menu"
          >
            <FiMenu size={19} />
          </button>

          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-xs">
              Admin Panel
            </p>

            <h1 className="mt-1 truncate text-lg font-semibold text-white sm:text-xl">
              {title}
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* Notifications */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#292929] text-gray-300 transition hover:border-[#C9A227] hover:text-[#C9A227]"
            aria-label="Notifications"
          >
            <FiBell size={18} />

            {/* Notification indicator */}
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#C9A227]" />
          </button>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-[#292929] sm:block" />

          {/* Profile */}
          <div className="group relative">

            <button
              type="button"
              className="flex items-center gap-3 rounded-xl px-1 py-1 transition hover:bg-[#111111]"
            >
              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C9A227] text-sm font-semibold text-black">
                {(user?.name || "Admin")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              {/* User info */}
              <div className="hidden text-left md:block">
                <p className="max-w-[140px] truncate text-sm font-medium text-white">
                  {user?.name || "Admin"}
                </p>

                <p className="text-[11px] capitalize text-gray-500">
                  {user?.role || "admin"}
                </p>
              </div>

              <FiChevronDown
                size={15}
                className="hidden text-gray-500 transition group-hover:text-[#C9A227] md:block"
              />
            </button>

            {/* Dropdown */}
            <div className="pointer-events-none absolute right-0 top-full mt-3 w-48 translate-y-2 rounded-xl border border-[#292929] bg-[#151515] p-2 opacity-0 shadow-2xl transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">

              <button
                type="button"
                onClick={logout}
                className="w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-300 transition hover:bg-[#0B0B0B] hover:text-[#C9A227]"
              >
                Logout
              </button>

            </div>
          </div>

        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

