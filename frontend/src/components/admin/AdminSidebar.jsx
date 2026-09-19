import { Link, NavLink } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiBarChart2,
  FiX,
} from "react-icons/fi";

const AdminSidebar = ({ isOpen, onClose }) => {
  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: FiHome,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: FiPackage,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: FiShoppingBag,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: FiUsers,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: FiBarChart2,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-[#292929] bg-[#0B0B0B] transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-[#292929] px-6">

          <Link to="/" onClick={onClose}>
            <img
              src="/vendora_logo_black.png"
              alt="Vendora"
              className="h-9 w-auto"
            />
          </Link>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#292929] text-gray-400 transition hover:border-[#C9A227] hover:text-[#C9A227] lg:hidden"
            aria-label="Close admin sidebar"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Admin label */}
        <div className="px-6 pb-3 pt-7">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C9A227]">
            Administration
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 pb-6">

          <div className="space-y-1">

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#C9A227] text-black"
                        : "text-gray-400 hover:bg-[#151515] hover:text-[#C9A227]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        className={
                          isActive
                            ? "text-black"
                            : "text-gray-500 group-hover:text-[#C9A227]"
                        }
                      />

                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}

          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#292929] p-4">

          <div className="rounded-xl border border-[#292929] bg-[#111111] p-4">

            <p className="text-xs font-medium text-gray-200">
              Vendora Admin
            </p>

            <p className="mt-1 text-[11px] leading-5 text-gray-600">
              Manage your store, customers and orders from one place.
            </p>

          </div>

        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
