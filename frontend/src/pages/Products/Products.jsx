import {
  useMemo,
  useState,
  useEffect,
} from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import ProductFilter from "../../components/product/ProductFilter";
import ProductGrid from "../../components/product/ProductGrid";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const Products = () => {
  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Accessories",
    "Home & Living",
  ];

  const [searchParams, setSearchParams] =
    useSearchParams();

  const urlSearch =
    searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] =
    useState(urlSearch);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("featured");

  const [showFilters, setShowFilters] =
    useState(false);

  const { addToCart } = useCart();

  // ==================================================
  // KEEP LOCAL SEARCH IN SYNC WITH URL
  // ==================================================

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // ==================================================
  // FETCH PRODUCTS
  // ==================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products", {
          params: {
            search: urlSearch.trim() || undefined,
          },
        });

        const formattedProducts = (
          response.data?.products || []
        ).map((product) => ({
          ...product,

          id: product._id,

          rating:
            Number(product.ratings) || 0,

          reviews:
            Number(product.numReviews) || 0,

          image:
            `${API_BASE_URL}/products/${product._id}/image`,
        }));

        setProducts(formattedProducts);
      } catch (err) {
        console.error(
          "FAILED TO FETCH PRODUCTS:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [urlSearch]);

  // ==================================================
  // PRODUCT FILTERING / SORTING
  // ==================================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          product.category ===
          selectedCategory
      );
    }

    /*
     * Keep local filtering as a second layer.
     *
     * Backend already handles Navbar search.
     * This also allows the search box inside
     * ProductFilter to keep working.
     */
    if (search.trim()) {
      const query =
        search.trim().toLowerCase();

      result = result.filter(
        (product) =>
          product.name
            ?.toLowerCase()
            .includes(query) ||
          product.category
            ?.toLowerCase()
            .includes(query) ||
          product.description
            ?.toLowerCase()
            .includes(query)
      );
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) =>
            Number(a.price) -
            Number(b.price)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) =>
            Number(b.price) -
            Number(a.price)
        );
        break;

      case "rating":
        result.sort(
          (a, b) =>
            Number(b.rating || 0) -
            Number(a.rating || 0)
        );
        break;

      case "name":
        result.sort((a, b) =>
          (a.name || "").localeCompare(
            b.name || ""
          )
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    products,
    search,
    selectedCategory,
    sortBy,
  ]);

  // ==================================================
  // PRODUCT SEARCH INPUT
  // ==================================================

  const handleSearchChange = (value) => {
    setSearch(value);

    const params = new URLSearchParams(
      searchParams
    );

    const trimmedValue = value.trim();

    if (trimmedValue) {
      params.set("search", trimmedValue);
    } else {
      params.delete("search");
    }

    setSearchParams(params);
  };

  // ==================================================
  // ADD TO CART
  // ==================================================

  const handleAddToCart = (product) => {
    if (!product?.id) {
      return;
    }

    addToCart(product, 1);
  };

  // ==================================================
  // CLEAR SEARCH
  // ==================================================

  const clearSearch = () => {
    const params = new URLSearchParams(
      searchParams
    );

    params.delete("search");

    setSearchParams(params);
    setSearch("");
  };

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
      {/* =================================================
          HEADER
      ================================================= */}

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
              Explore premium products across
              fashion, electronics, accessories and
              home essentials.
            </p>

            {/* Navbar search result */}
            {urlSearch && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-4 py-2 text-xs text-[#E2C45A]">
                  Search: "{urlSearch}"
                </span>

                <button
                  type="button"
                  onClick={clearSearch}
                  className="text-xs text-gray-500 transition hover:text-[#C9A227]"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 xl:px-12">
        <ProductFilter
          search={search}
          setSearch={handleSearchChange}
          selectedCategory={
            selectedCategory
          }
          setSelectedCategory={
            setSelectedCategory
          }
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#292929] border-t-[#C9A227]" />

            <p className="mt-4 text-sm text-gray-500">
              Loading products...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-center">
            <p className="text-sm text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-4 rounded-xl border border-[#292929] px-5 py-2.5 text-sm text-gray-300 transition hover:border-[#C9A227] hover:text-[#C9A227]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products */}
        {!loading && !error && (
          <>
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

            {filteredProducts.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-[#292929] bg-[#151515] p-10 text-center">
                <h2 className="text-lg font-semibold text-white">
                  No products found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Try a different search term or
                  category.
                </p>

                <button
                  type="button"
                  onClick={clearSearch}
                  className="mt-5 rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="mt-8">
                <ProductGrid
                  products={filteredProducts}
                  onAddToCart={
                    handleAddToCart
                  }
                />
              </div>
            )}
          </>
        )}

        {/* Back */}
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