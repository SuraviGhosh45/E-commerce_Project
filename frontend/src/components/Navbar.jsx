import { CiSearch } from "react-icons/ci";
import { TiShoppingCart } from "react-icons/ti";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="w-full border-b border-[#292929] bg-[#0B0B0B] px-6 py-4 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        {/* Logo */}
        <div>
          <Link to="/">
            <img
              src="/vendora_logo_black.png"
              alt="Vendora"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <div>
          <ul className="flex items-center gap-8 text-sm font-medium text-gray-200">

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

                {/* Analytics */}
                <li>
                  <Link
                    to="/admin/analytics"
                    className="transition-colors hover:text-[#C9A227]"
                  >
                    Analytics
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
                className="flex items-center gap-1 text-gray-200 transition-colors hover:text-[#C9A227]"
              >
                <CiSearch size={22} />
                <span>Search</span>
              </button>
            </li>

            {/* Cart - Customer only */}
            {(!isAuthenticated || user?.role !== "admin") && (
              <li>
                <Link
                  to="/cart"
                  className="flex items-center gap-1 text-gray-200 transition-colors hover:text-[#C9A227]"
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
                    className="rounded-md border border-[#C9A227] px-4 py-2 text-white transition-all hover:bg-[#C9A227] hover:text-black"
                  >
                    Login
                  </Link>
                </li>

                {/* Register */}
                <li>
                  <Link
                    to="/register"
                    className="rounded-md bg-[#C9A227] px-4 py-2 text-black transition-all hover:bg-[#E2C45A]"
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
                    className="text-gray-200 transition-colors hover:text-[#C9A227]"
                  >
                    {user?.name || "Profile"}
                  </Link>
                </li>

                {/* Logout */}
                <li>
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-md border border-gray-600 px-4 py-2 text-white transition-all hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-black"
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
