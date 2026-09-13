
import { CiSearch } from "react-icons/ci";
import { FaSun, FaMoon } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav
      className={`w-full border-b px-6 py-4 transition-colors duration-300 ${
        isDark
          ? "border-[#292929] bg-[#0B0B0B] text-white"
          : "border-gray-200 bg-white text-black"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        {/* Logo */}
        <div>
          <Link to="/">
            <img
              src={
                isDark
                  ? "/vendora_logo_white.png"
                  : "/vendora_logo_black.png"
              }
              alt="Vendora"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <div>
          <ul
            className={`flex items-center gap-8 text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
          >

            {/* Admin Navigation */}
            {isAuthenticated && user?.role === "admin" ? (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="transition-colors hover:text-[#C9A227]"
                  >
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link
                    to="/admin/products"
                    className="transition-colors hover:text-[#C9A227]"
                  >
                    Products
                  </Link>
                </li>

                <li>
                  <Link
                    to="/admin/orders"
                    className="transition-colors hover:text-[#C9A227]"
                  >
                    Orders
                  </Link>
                </li>

                <li>
                  <Link
                    to="/admin/users"
                    className="transition-colors hover:text-[#C9A227]"
                  >
                    Users
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/"
                    className="transition-colors hover:text-[#C9A227]"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    to="/shop"
                    className="transition-colors hover:text-[#C9A227]"
                  >
                    Shop
                  </Link>
                </li>

                <li>
                  <Link
                    to="/categories"
                    className="transition-colors hover:text-[#C9A227]"
                  >
                    Categories
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Right Side */}
        <div>
          <ul className="flex items-center gap-5">

            {/* Search */}
            <li>
              <button
                type="button"
                className={`flex items-center gap-1 transition-colors hover:text-[#C9A227] ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <CiSearch size={22} />
                <span>Search</span>
              </button>
            </li>

            {/* Theme */}
            <li>
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className={`flex items-center gap-2 transition-colors hover:text-[#C9A227] ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {isDark ? (
                  <FaSun size={18} />
                ) : (
                  <FaMoon size={18} />
                )}

                <span>{isDark ? "Light" : "Dark"}</span>
              </button>
            </li>

            {/* Cart - Customer only */}
            {(!isAuthenticated || user?.role !== "admin") && (
              <li>
                <Link
                  to="/cart"
                  className={`flex items-center gap-1 transition-colors hover:text-[#C9A227] ${
                    isDark ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <TiShoppingCart size={23} />
                  <span>Cart</span>
                </Link>
              </li>
            )}

            {/* Authentication */}
            {!isAuthenticated ? (
              <>
                {/* Login */}
                <li>
                  <Link
                    to="/login"
                    className={`rounded-md border px-4 py-2 transition-all ${
                      isDark
                        ? "border-[#C9A227] text-white hover:bg-[#C9A227] hover:text-black"
                        : "border-black text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    Login
                  </Link>
                </li>

                {/* Register */}
                <li>
                  <Link
                    to="/register"
                    className={`rounded-md px-4 py-2 transition-all ${
                      isDark
                        ? "bg-[#C9A227] text-black hover:bg-[#E2C45A]"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Profile */}
                <li>
                  <Link
                    to="/profile"
                    className={`transition-colors hover:text-[#C9A227] ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {user?.name || "Profile"}
                  </Link>
                </li>

                {/* Logout */}
                <li>
                  <button
                    type="button"
                    onClick={logout}
                    className={`rounded-md border px-4 py-2 transition-all ${
                      isDark
                        ? "border-gray-600 text-white hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-black"
                        : "border-black text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

