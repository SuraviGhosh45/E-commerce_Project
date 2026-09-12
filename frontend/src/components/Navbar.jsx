import { CiSearch } from "react-icons/ci";
import { FaAffiliatetheme } from "react-icons/fa";
import { TiShoppingCart } from "react-icons/ti";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full border-b border-gray-200 bg-white px-6 py-4">
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

        {/* Main Navigation */}
        <div>
          <ul className="flex items-center gap-8 text-sm font-medium text-gray-800">
            <li>
              <Link
                to="/"
                className="transition hover:text-gray-500"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/shop"
                className="transition hover:text-gray-500"
              >
                Shop
              </Link>
            </li>

            <li>
              <Link
                to="/categories"
                className="transition hover:text-gray-500"
              >
                Categories
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Side */}
        <div>
          <ul className="flex items-center gap-5 text-gray-800">

            <li className="flex cursor-pointer items-center gap-1 hover:text-gray-500">
              <CiSearch size={22} />
              <span>Search</span>
            </li>

            <li className="flex cursor-pointer items-center gap-1 hover:text-gray-500">
              <FaAffiliatetheme size={18} />
              <span>Theme</span>
            </li>

            <li>
              <Link
                to="/cart"
                className="flex items-center gap-1 hover:text-gray-500"
              >
                <TiShoppingCart size={23} />
                <span>Cart</span>
              </Link>
            </li>

            <li className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-md border border-black px-4 py-2 transition hover:bg-black hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-md bg-black px-4 py-2 text-white transition hover:bg-gray-800"
              >
                Register
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;