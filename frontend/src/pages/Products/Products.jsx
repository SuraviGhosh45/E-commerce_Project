import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import products from "../../data/product";

import ProductFilter from "../../components/product/ProductFilter";
import ProductGrid from "../../components/product/ProductGrid";

const Products = () => {
  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Accessories",
    "Home & Living",
  ];

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Filter + search + sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;

      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;

      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      default:
        break;
    }

    return result;
  }, [search, selectedCategory, sortBy]);

  // Temporary frontend-only cart action
  const handleAddToCart = (product) => {
    console.log("Add to cart:", product);
  };

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">

      {/* ================= HEADER ================= */}
      <section className="border-b border-[#292929] bg-black">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10 xl:px-12">

          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-sm">
              Vendora Collection
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Shop everything you love.
            </h1>

            <p className="mt-4 text-sm leading-7 text-gray-400 sm:text-base">
              Explore premium products across fashion, electronics,
              accessories and home essentials.
            </p>
          </div>

        </div>
      </section>

      {/* ================= SHOP CONTENT ================= */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 xl:px-12">

        {/* Filters */}
        <ProductFilter
          search={search}
          setSearch={setSearch}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* Result information */}
        <div className="mt-8 flex items-center justify-between border-b border-[#292929] pb-5">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-300">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

          <p className="hidden text-sm text-gray-500 sm:block">
            {selectedCategory}
          </p>

        </div>

        {/* Product Grid */}
        <div className="mt-8">
          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Back to top / continue */}
        <div className="mt-12 border-t border-[#292929] pt-8">
          <Link
            to="/"
            className="text-sm text-gray-500 transition hover:text-[#C9A227]"
          >
            ← Back to Home
          </Link>
        </div>

      </section>
    </main>
  );
};

export default Products;

