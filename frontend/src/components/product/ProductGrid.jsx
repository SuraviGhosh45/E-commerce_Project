
import { FiSearch } from "react-icons/fi";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, onAddToCart }) => {
  if (!products || products.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-[#292929] bg-[#111111] px-6 py-20 text-center">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#151515] text-gray-500">
          <FiSearch size={22} />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-white">
          No products found
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          Try changing your search term, category, or sorting options.
        </p>

      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;

