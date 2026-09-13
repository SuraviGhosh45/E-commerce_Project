
import { Link } from "react-router-dom";
import {
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiArrowUp,
} from "react-icons/fi";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-gray-200 bg-white text-black transition-colors duration-300 dark:border-[#292929] dark:bg-[#0B0B0B] dark:text-white">

      {/* ================= MAIN FOOTER ================= */}
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">

            <Link to="/">
              <img
                src="/vendora_logo_black.png"
                alt="Vendora"
                className="h-9 w-auto dark:hidden"
              />

              <img
                src="/vendora_logo_white.png"
                alt="Vendora"
                className="hidden h-9 w-auto dark:block"
              />
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-gray-500 dark:text-gray-400">
              A modern shopping experience built around quality products,
              simple design and everyday convenience.
            </p>

            {/* Social Icons */}
            <div className="mt-7 flex items-center gap-3">

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:border-[#C9A227] hover:text-[#C9A227] dark:border-[#292929]"
              >
                <FiInstagram size={17} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:border-[#C9A227] hover:text-[#C9A227] dark:border-[#292929]"
              >
                <FiTwitter size={17} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition hover:border-[#C9A227] hover:text-[#C9A227] dark:border-[#292929]"
              >
                <FiFacebook size={17} />
              </a>

            </div>
          </div>

          {/* Shop */}
          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Shop
            </h3>

            <ul className="mt-6 space-y-4 text-sm text-gray-500 dark:text-gray-400">

              <li>
                <Link
                  to="/shop"
                  className="transition hover:text-[#C9A227]"
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  to="/categories"
                  className="transition hover:text-[#C9A227]"
                >
                  Categories
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?featured=true"
                  className="transition hover:text-[#C9A227]"
                >
                  Featured
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?new=true"
                  className="transition hover:text-[#C9A227]"
                >
                  New Arrivals
                </Link>
              </li>

            </ul>
          </div>

          {/* Customer */}
          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Customer
            </h3>

            <ul className="mt-6 space-y-4 text-sm text-gray-500 dark:text-gray-400">

              <li>
                <Link
                  to="/profile"
                  className="transition hover:text-[#C9A227]"
                >
                  My Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="transition hover:text-[#C9A227]"
                >
                  My Orders
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="transition hover:text-[#C9A227]"
                >
                  Shopping Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="transition hover:text-[#C9A227]"
                >
                  Sign In
                </Link>
              </li>

            </ul>
          </div>

          {/* Information */}
          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Information
            </h3>

            <ul className="mt-6 space-y-4 text-sm text-gray-500 dark:text-gray-400">

              <li>
                <a
                  href="#"
                  className="transition hover:text-[#C9A227]"
                >
                  About Vendora
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition hover:text-[#C9A227]"
                >
                  Contact Us
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition hover:text-[#C9A227]"
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="transition hover:text-[#C9A227]"
                >
                  Terms & Conditions
                </a>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-gray-200 dark:border-[#292929]">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-6 text-sm text-gray-500 sm:flex-row">

          <p>
            © {new Date().getFullYear()} Vendora. All rights reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-2 transition hover:text-[#C9A227]"
          >
            Back to top

            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 transition group-hover:border-[#C9A227] dark:border-[#292929]">
              <FiArrowUp size={15} />
            </span>
          </button>

        </div>
      </div>

    </footer>
  );
};

export default Footer;

