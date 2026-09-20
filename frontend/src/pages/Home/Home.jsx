import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiStar,
} from "react-icons/fi";

const Home = () => {
  const categories = [
    {
      name: "Electronics",
      description: "Smart technology for everyday life",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Fashion",
      description: "Timeless styles for every occasion",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Accessories",
      description: "Complete your everyday look",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    },
    {
      name: "Home & Living",
      description: "Make your space feel like home",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "Premium Headphones",
      category: "Electronics",
      price: "₹129",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 2,
      name: "Minimal Watch",
      category: "Accessories",
      price: "₹89",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 3,
      name: "Modern Sneakers",
      category: "Fashion",
      price: "₹110",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
    },
    {
      id: 4,
      name: "Designer Chair",
      category: "Home & Living",
      price: "₹249",
      image:
        "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=700&q=80",
    },
  ];

  const useScrollAnimation = () => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const element = ref.current;

      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -40px 0px",
        }
      );

      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }, []);

    return [ref, isVisible];
  };

  const [heroContentRef, heroContentVisible] = useScrollAnimation();
  const [heroVisualRef, heroVisualVisible] = useScrollAnimation();
  const [categoriesRef, categoriesVisible] = useScrollAnimation();
  const [featuredRef, featuredVisible] = useScrollAnimation();
  const [promoRef, promoVisible] = useScrollAnimation();
  const [whyRef, whyVisible] = useScrollAnimation();

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-black">

        <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full border border-[#C9A227]/15 sm:-right-40 sm:-top-40 sm:h-[420px] sm:w-[420px]" />

        <div className="absolute -bottom-40 -left-32 h-64 w-64 rounded-full border border-[#C9A227]/10 sm:-bottom-52 sm:-left-40 sm:h-[420px] sm:w-[420px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 md:py-24 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-28 xl:px-12">

          {/* ================= HERO CONTENT ================= */}
          <div
            ref={heroContentRef}
            className={`max-w-2xl transform transition-all duration-1000 ease-out ${
              heroContentVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >

            <div className="mb-5 flex items-center gap-3 sm:mb-6">
              <span className="h-px w-8 bg-[#C9A227] sm:w-10" />

              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-sm sm:tracking-[0.3em]">
                Welcome to Vendora
              </p>
            </div>

            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
              Everything you want.
              <span className="mt-2 block text-[#C9A227]">
                One place.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-gray-400 sm:mt-7 sm:text-base md:text-lg">
              Discover premium products, modern essentials and everyday
              favorites — carefully selected to make your shopping experience
              better.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">

              <Link
                to="/shop"
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#C9A227] px-6 py-3.5 font-medium text-black transition hover:bg-[#E2C45A] sm:w-auto"
              >
                Shop Now

                <FiArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/categories"
                className="flex w-full items-center justify-center rounded-xl border border-[#444] px-6 py-3.5 font-medium text-white transition hover:border-[#C9A227] hover:text-[#C9A227] sm:w-auto"
              >
                Explore Categories
              </Link>

            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#292929] pt-7 sm:mt-12 sm:gap-8 sm:pt-8">

              <div>
                <p className="text-xl font-semibold text-[#C9A227] sm:text-2xl">
                  10K+
                </p>
                <p className="mt-1 text-[11px] text-gray-500 sm:text-xs">
                  Products
                </p>
              </div>

              <div>
                <p className="text-xl font-semibold text-[#C9A227] sm:text-2xl">
                  5K+
                </p>
                <p className="mt-1 text-[11px] text-gray-500 sm:text-xs">
                  Customers
                </p>
              </div>

              <div>
                <p className="text-xl font-semibold text-[#C9A227] sm:text-2xl">
                  4.9
                </p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-500 sm:text-xs">
                  <FiStar className="text-[#C9A227]" size={11} />
                  Rating
                </p>
              </div>

            </div>
          </div>

          {/* ================= HERO VISUAL ================= */}
          <div
            ref={heroVisualRef}
            className={`relative mx-auto mt-4 h-[360px] w-full max-w-md transform transition-all duration-1000 delay-200 ease-out sm:h-[440px] lg:mt-0 lg:h-[520px] lg:max-w-none ${
              heroVisualVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-12 opacity-0"
            }`}
          >

            <div className="absolute right-0 top-3 h-[290px] w-[220px] rotate-3 overflow-hidden rounded-[1.5rem] border border-white/10 sm:h-[380px] sm:w-[280px] sm:rounded-[2rem] lg:h-[440px] lg:w-[340px]">

              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85"
                alt="Vendora featured product"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black/10" />
            </div>

            <div className="absolute bottom-0 left-0 w-40 -rotate-6 overflow-hidden rounded-xl border border-white/10 bg-[#111111] p-2.5 shadow-2xl sm:left-4 sm:w-52 sm:rounded-2xl sm:p-3">

              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
                alt="Premium headphones"
                className="h-28 w-full rounded-lg object-cover sm:h-44 sm:rounded-xl"
              />

              <div className="px-1 pb-1 pt-2 sm:px-2 sm:pt-3">
                <p className="text-[10px] text-gray-500 sm:text-xs">
                  Featured
                </p>

                <p className="mt-1 text-xs font-medium sm:text-sm">
                  Premium Audio
                </p>

                <p className="mt-1 text-xs text-[#C9A227] sm:text-sm">
                  ₹129
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section
        ref={categoriesRef}
        className={`mx-auto max-w-7xl transform px-5 py-16 transition-all duration-1000 ease-out sm:px-8 sm:py-20 lg:px-10 lg:py-24 xl:px-12 ${
          categoriesVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0"
        }`}
      >

        <div className="mb-8 flex items-end justify-between sm:mb-10 lg:mb-12">

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-sm">
              Shop by category
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Find what fits you.
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-gray-400">
              Explore our collections and discover products made for every
              part of your lifestyle.
            </p>
          </div>

          <Link
            to="/categories"
            className="hidden items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-[#C9A227] sm:flex"
          >
            View all
            <FiArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map((category, index) => (
            <Link
              key={category.name}
              to={`/shop?category=${category.name}`}
              style={{
                transitionDelay: categoriesVisible
                  ? `${index * 120}ms`
                  : "0ms",
              }}
              className={`group relative h-[300px] transform overflow-hidden rounded-2xl border border-[#292929] bg-[#151515] transition-all duration-700 sm:h-[340px] lg:h-[360px] ${
                categoriesVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">

                <h3 className="text-lg font-semibold sm:text-xl">
                  {category.name}
                </h3>

                <p className="mt-2 text-xs leading-5 text-gray-300 sm:text-sm">
                  {category.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#E2C45A] sm:text-sm">
                  Shop now
                  <FiArrowRight size={15} />
                </div>

              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section
        ref={featuredRef}
        className={`border-y border-[#292929] bg-[#111111] transform transition-all duration-1000 ease-out ${
          featuredVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0"
        }`}
      >

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24 xl:px-12">

          <div className="flex items-end justify-between">

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-sm">
                Curated for you
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                Featured products
              </h2>
            </div>

            <Link
              to="/shop"
              className="hidden items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-[#C9A227] sm:flex"
            >
              Shop all
              <FiArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">

            {featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                style={{
                  transitionDelay: featuredVisible
                    ? `${index * 120}ms`
                    : "0ms",
                }}
                className={`group transform overflow-hidden rounded-2xl border border-[#292929] bg-[#0B0B0B] transition-all duration-700 hover:-translate-y-1 hover:border-[#C9A227] ${
                  featuredVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                <div className="relative h-64 overflow-hidden bg-[#151515] sm:h-72">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-[10px] font-medium text-[#E2C45A] sm:left-4 sm:top-4 sm:text-xs">
                    Featured
                  </div>
                </div>

                <div className="p-4 sm:p-5">

                  <p className="text-[10px] uppercase tracking-wider text-gray-500 sm:text-xs">
                    {product.category}
                  </p>

                  <h3 className="mt-2 text-sm font-semibold sm:text-base">
                    {product.name}
                  </h3>

                  <div className="mt-4 flex items-center justify-between">

                    <p className="text-base font-semibold text-[#C9A227] sm:text-lg">
                      {product.price}
                    </p>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A227] text-black transition group-hover:bg-[#E2C45A] sm:h-9 sm:w-9">
                      <FiArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PROMOTIONAL BANNER ================= */}
      <section
        ref={promoRef}
        className={`mx-auto max-w-7xl transform px-5 py-16 transition-all duration-1000 ease-out sm:px-8 sm:py-20 lg:px-10 lg:py-24 xl:px-12 ${
          promoVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0"
        }`}
      >

        <div className="relative overflow-hidden rounded-2xl bg-black px-6 py-12 sm:rounded-3xl sm:px-10 sm:py-14 lg:px-16 lg:py-16">

          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full border border-[#C9A227]/15 sm:-right-24 sm:-top-24 sm:h-80 sm:w-80" />

          <div className="relative max-w-2xl">

            <p className="text-[11px] uppercase tracking-[0.25em] text-[#C9A227] sm:text-sm sm:tracking-[0.3em]">
              New collection
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
              Upgrade the way
              <br />
              you shop.
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-400 sm:mt-5 sm:text-base">
              Explore the latest products and discover a collection built
              around quality, design and everyday value.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#C9A227] px-6 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A] sm:mt-8 sm:w-auto"
            >
              Discover products
              <FiArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHY VENDORA ================= */}
      <section
        ref={whyRef}
        className={`border-t border-[#292929] transform transition-all duration-1000 ease-out ${
          whyVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-12 opacity-0"
        }`}
      >

        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-20 xl:px-12">

          <div className="mb-10 text-center sm:mb-14">

            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-sm">
              Why Vendora
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Shopping made simple.
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">

            <div className="text-center transition-transform duration-500 hover:-translate-y-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#151515] text-[#C9A227] sm:h-14 sm:w-14">
                <FiTruck size={21} />
              </div>

              <h3 className="mt-4 font-semibold sm:mt-5">
                Fast Delivery
              </h3>

              <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-gray-500 sm:text-sm">
                Reliable delivery designed to get your order to you quickly.
              </p>
            </div>

            <div className="text-center transition-transform duration-500 hover:-translate-y-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#151515] text-[#C9A227] sm:h-14 sm:w-14">
                <FiShield size={21} />
              </div>

              <h3 className="mt-4 font-semibold sm:mt-5">
                Secure Shopping
              </h3>

              <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-gray-500 sm:text-sm">
                Shop confidently with a secure and reliable experience.
              </p>
            </div>

            <div className="text-center transition-transform duration-500 hover:-translate-y-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#151515] text-[#C9A227] sm:h-14 sm:w-14">
                <FiRefreshCw size={21} />
              </div>

              <h3 className="mt-4 font-semibold sm:mt-5">
                Easy Returns
              </h3>

              <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-gray-500 sm:text-sm">
                Simple returns that make shopping stress-free.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;