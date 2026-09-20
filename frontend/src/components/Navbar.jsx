import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { TiShoppingCart } from "react-icons/ti";
import {
  FiX,
  FiArrowRight,
  FiMenu,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import OrderMenu from "./OrderMenu.jsx";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin =
    isAuthenticated && user?.role === "admin";

  const isCustomer =
    isAuthenticated && user?.role !== "admin";

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      navigate(isAdmin ? "/admin/products" : "/shop");
      setSearchOpen(false);
      return;
    }

    if (isAdmin) {
      navigate(
        `/admin/products?search=${encodeURIComponent(query)}`
      );
    } else {
      navigate(
        `/shop?search=${encodeURIComponent(query)}`
      );
    }

    setSearchOpen(false);
  };

  const closeSearch = () => {
    setSearch("");
    setSearchOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileLogout = () => {
    setMobileMenuOpen(false);
    logout();
  };

  return (
    <nav className="w-full border-b border-[#292929] bg-[#0B0B0B] px-4 py-4 text-white sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">

        {/* ================= LOGO ================= */}
        <div className="shrink-0">
          <Link to="/" onClick={closeMobileMenu}>
            <img
              src="/vendora_logo_black.png"
              alt="Vendora"
              className="h-9 w-auto sm:h-10"
            />
          </Link>
        </div>

        {/* ================= DESKTOP NAVIGATION ================= */}
        <div className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium text-gray-200">

            {/* ================= ADMIN NAVIGATION ================= */}
            {isAdmin ? (
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
              /* ================= CUSTOMER / PUBLIC NAVIGATION ================= */
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

                {/* My Orders - Logged-in Customers Only */}
                {isCustomer && (
                  <li>
                    <OrderMenu />
                  </li>
                )}
              </>
            )}
          </ul>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* ================= SEARCH ================= */}
          <div className="relative">
            {!searchOpen ? (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1 text-gray-200 transition-colors hover:text-[#C9A227]"
              >
                <CiSearch size={22} />

                <span className="hidden sm:inline">
                  Search
                </span>
              </button>
            ) : (
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2"
              >
                <div className="flex items-center rounded-xl border border-[#292929] bg-[#151515] focus-within:border-[#C9A227]">

                  <CiSearch
                    size={21}
                    className="ml-3 shrink-0 text-gray-500"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search products..."
                    autoFocus
                    className="w-32 bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-gray-600 sm:w-52"
                  />

                  <button
                    type="submit"
                    className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-[#C9A227] hover:text-black"
                    aria-label="Search"
                  >
                    <FiArrowRight size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={closeSearch}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#292929] text-gray-500 transition hover:border-[#C9A227] hover:text-[#C9A227]"
                  aria-label="Close search"
                >
                  <FiX size={16} />
                </button>
              </form>
            )}
          </div>

          {/* ================= CART - CUSTOMER ONLY ================= */}
          {(!isAuthenticated || !isAdmin) && (
            <Link
              to="/cart"
              className="flex items-center gap-1 text-gray-200 transition-colors hover:text-[#C9A227]"
            >
              <TiShoppingCart size={23} />

              <span className="hidden sm:inline">
                Cart
              </span>
            </Link>
          )}

          {/* ================= AUTHENTICATION ================= */}

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="rounded-md border border-[#C9A227] px-3 py-2 text-sm text-white transition-all hover:bg-[#C9A227] hover:text-black sm:px-4"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="hidden rounded-md bg-[#C9A227] px-4 py-2 text-sm text-black transition-all hover:bg-[#E2C45A] sm:block"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* PROFILE */}
              <Link
                to="/profile"
                className="hidden text-sm text-gray-200 transition-colors hover:text-[#C9A227] sm:block"
              >
                {user?.name || "Profile"}
              </Link>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-md border border-gray-600 px-3 py-2 text-sm text-white transition-all hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-black sm:block sm:px-4"
              >
                Logout
              </button>
            </>
          )}

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((prev) => !prev)
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#292929] text-gray-200 transition hover:border-[#C9A227] hover:text-[#C9A227] md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <FiX size={21} />
            ) : (
              <FiMenu size={21} />
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="mx-auto mt-4 max-w-7xl border-t border-[#292929] pt-4 md:hidden">

          <div className="flex flex-col gap-1">

            {/* ================= CUSTOMER MOBILE NAVIGATION ================= */}
            {!isAdmin ? (
              <>
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-[#151515] hover:text-[#C9A227]"
                >
                  Home
                </Link>

                <Link
                  to="/shop"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-[#151515] hover:text-[#C9A227]"
                >
                  Shop
                </Link>

                <Link
                  to="/categories"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-[#151515] hover:text-[#C9A227]"
                >
                  Categories
                </Link>

                {/* MY ORDERS */}
                {isCustomer && (
                  <div
                    onClick={closeMobileMenu}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-[#151515] hover:text-[#C9A227]"
                  >
                    <OrderMenu />
                  </div>
                )}
              </>
            ) : (
              /* ================= ADMIN MOBILE NAVIGATION ================= */
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-[#151515] hover:text-[#C9A227]"
                >
                  Dashboard
                </Link>

                <Link
                  to="/admin/products"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-[#151515] hover:text-[#C9A227]"
                >
                  Products
                </Link>

                <Link
                  to="/admin/orders"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-[#151515] hover:text-[#C9A227]"
                >
                  Orders
                </Link>

                <Link
                  to="/admin/users"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-[#151515] hover:text-[#C9A227]"
                >
                  Users
                </Link>

                <Link
                  to="/admin/analytics"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-[#151515] hover:text-[#C9A227]"
                >
                  Analytics
                </Link>
              </>
            )}

            {/* ================= MOBILE PROFILE ================= */}
            {isAuthenticated && (
              <>
                <div className="my-2 border-t border-[#292929]" />

                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-[#151515] hover:text-[#C9A227]"
                >
                  {user?.name || "Profile"}
                </Link>

                <button
                  type="button"
                  onClick={handleMobileLogout}
                  className="w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-200 transition hover:bg-[#151515] hover:text-[#C9A227]"
                >
                  Logout
                </button>
              </>
            )}

            {/* ================= MOBILE LOGIN / REGISTER ================= */}
            {!isAuthenticated && (
              <>
                <div className="my-2 border-t border-[#292929]" />

                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-[#151515] hover:text-[#C9A227]"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-lg bg-[#C9A227] px-4 py-3 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;