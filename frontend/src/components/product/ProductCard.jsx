
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiShoppingCart,
  FiStar,
} from "react-icons/fi";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#292929] bg-[#111111] transition duration-300 hover:-translate-y-1 hover:border-[#C9A227]">

      {/* Image */}
      <div className="relative h-72 overflow-hidden bg-[#151515]">

        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Wishlist */}
        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-sm transition hover:bg-[#C9A227] hover:text-black"
        >
          <FiHeart size={16} />
        </button>

        {/* Low stock */}
        {product.stock <= 10 && (
          <span className="absolute left-3 top-3 rounded-full bg-[#C9A227] px-3 py-1 text-[10px] font-semibold text-black">
            Low stock
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-5">

        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500 sm:text-xs">
          {product.category}
        </p>

        <Link to={`/products/${product.id}`}>
          <h3 className="mt-2 line-clamp-1 text-base font-semibold text-white transition group-hover:text-[#C9A227]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2">

          <div className="flex items-center gap-1 text-[#C9A227]">
            <FiStar size={13} fill="currentColor" />

            <span className="text-xs font-medium">
              {product.rating}
            </span>
          </div>

          <span className="text-xs text-gray-600">
            ({product.reviews})
          </span>
        </div>

        {/* Price / Cart */}
        <div className="mt-4 flex items-center justify-between gap-3">

          <div>
            <p className="text-lg font-semibold text-[#C9A227]">
              ${product.price}
            </p>

            <p className="mt-1 text-[11px] text-gray-600">
              {product.stock > 0
                ? `${product.stock} left in stock`
                : "Out of stock"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            disabled={product.stock <= 0}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C9A227] text-black transition hover:bg-[#E2C45A] disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500"
            aria-label={`Add ${product.name} to cart`}
          >
            <FiShoppingCart size={17} />
          </button>

        </div>
      </div>
    </article>
  );
};

export default ProductCard;

