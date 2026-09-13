import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiGrid,
  FiShoppingBag,
} from "react-icons/fi";

const Categories = () => {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">

      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-5 py-16 sm:px-8">

        {/* Decorative circles */}
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full border border-[#C9A227]/10" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full border border-[#C9A227]/10" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">

          {/* Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#292929] bg-[#151515] text-[#C9A227]">
            <FiGrid size={30} />
          </div>

          {/* Label */}
          <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A227] sm:text-sm">
            Coming Soon
          </p>

          {/* Heading */}
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Categories are
            <br />
            <span className="text-gray-500">
              coming soon.
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            We're working on a better way to explore Vendora by category.
            For now, you can discover all available products through our shop.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-6 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
            >
              Explore Shop
              <FiArrowRight size={17} />
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#292929] bg-[#151515] px-6 py-3.5 text-sm font-medium text-gray-300 transition hover:border-[#C9A227] hover:text-[#C9A227]"
            >
              Back to Home
              <FiShoppingBag size={17} />
            </Link>

          </div>

          {/* Bottom note */}
          <div className="mx-auto mt-12 max-w-md border-t border-[#292929] pt-6">
            <p className="text-xs leading-6 text-gray-600">
              Category-based browsing will be available in a future update.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
};

export default Categories;
