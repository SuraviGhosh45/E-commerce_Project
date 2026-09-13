
import { FiChevronDown, FiSearch, FiSliders } from "react-icons/fi";

const ProductFilter = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  categories,
  showFilters,
  setShowFilters,
}) => {
  return (
    <div>

      {/* Search + Sort */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}
        <div className="relative w-full lg:max-w-md">

          <FiSearch
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border border-[#292929] bg-[#151515] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227]"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">

          {/* Mobile filters */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#292929] bg-[#151515] px-5 py-3 text-sm text-gray-200 transition hover:border-[#C9A227] hover:text-[#C9A227] lg:hidden"
          >
            <FiSliders size={17} />
            Filters
          </button>

          {/* Sort */}
          <div className="relative min-w-[180px]">

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#292929] bg-[#151515] px-4 py-3 text-sm text-gray-200 outline-none transition focus:border-[#C9A227]"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name: A-Z</option>
            </select>

            <FiChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div
        className={`mt-6 ${
          showFilters ? "block" : "hidden lg:block"
        }`}
      >
        <div className="flex flex-wrap gap-2">

          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition sm:text-sm ${
                  active
                    ? "bg-[#C9A227] text-black"
                    : "border border-[#292929] bg-[#151515] text-gray-400 hover:border-[#C9A227] hover:text-[#C9A227]"
                }`}
              >
                {category}
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default ProductFilter;

