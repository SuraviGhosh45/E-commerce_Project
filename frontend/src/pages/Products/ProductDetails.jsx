import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiHeart,
  FiMinus,
  FiPlus,
  FiShoppingCart,
  FiStar,
  FiTruck,
  FiShield,
  FiCheck,
} from "react-icons/fi";

import products from "../../data/product";
import { useCart } from "../../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Product not found
  if (!product) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] px-5 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#292929] bg-[#151515] p-10 text-center sm:p-16">

          <h1 className="text-2xl font-semibold sm:text-3xl">
            Product not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            The product you're looking for doesn't exist or may have been
            removed.
          </p>

          <Link
            to="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-6 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
          >
            <FiArrowLeft size={16} />
            Back to Shop
          </Link>

        </div>
      </main>
    );
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);

    setIsAdded(true);

    // Reset button after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">

      {/* ================= BREADCRUMB ================= */}
      <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8 lg:px-10 xl:px-12">
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm">

          <Link
            to="/"
            className="transition hover:text-[#C9A227]"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/shop"
            className="transition hover:text-[#C9A227]"
          >
            Shop
          </Link>

          <span>/</span>

          <span className="text-gray-300">
            {product.name}
          </span>

        </div>
      </div>

      {/* ================= PRODUCT ================= */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-16 xl:px-12">

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">

          {/* ================= IMAGE ================= */}
          <div>

            <div className="relative overflow-hidden rounded-2xl border border-[#292929] bg-[#151515] sm:rounded-3xl">

              <img
                src={product.image}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />

              {/* Wishlist */}
              <button
                type="button"
                onClick={() =>
                  setIsWishlisted((current) => !current)
                }
                aria-label={
                  isWishlisted
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm transition ${
                  isWishlisted
                    ? "bg-[#C9A227] text-black"
                    : "bg-black/70 text-white hover:bg-[#C9A227] hover:text-black"
                }`}
              >
                <FiHeart
                  size={18}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>

              {/* Category */}
              <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#E2C45A] backdrop-blur-sm sm:text-xs">
                {product.category}
              </span>

            </div>

            {/* Small Info Cards */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-4">

              <div className="rounded-xl border border-[#292929] bg-[#151515] p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                    <FiTruck size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white">
                      Fast Delivery
                    </p>

                    <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                      Available
                    </p>
                  </div>

                </div>
              </div>

              <div className="rounded-xl border border-[#292929] bg-[#151515] p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                    <FiShield size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white">
                      Secure Purchase
                    </p>

                    <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                      Protected
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* ================= DETAILS ================= */}
          <div className="flex flex-col">

            {/* Category */}
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-sm">
              {product.category}
            </p>

            {/* Title */}
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-5 flex flex-wrap items-center gap-3">

              <div className="flex items-center gap-1 text-[#C9A227]">
                <FiStar size={16} fill="currentColor" />

                <span className="text-sm font-medium">
                  {product.rating}
                </span>
              </div>

              <span className="text-sm text-gray-500">
                ({product.reviews} reviews)
              </span>

              <span className="h-1 w-1 rounded-full bg-gray-700" />

              <span
                className={`text-sm font-medium ${
                  product.stock > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {product.stock > 0
                  ? "In stock"
                  : "Out of stock"}
              </span>

            </div>

            {/* Price */}
            <div className="mt-7 border-b border-[#292929] pb-7">

              <p className="text-3xl font-semibold text-[#C9A227] sm:text-4xl">
                ${product.price}
              </p>

              {product.stock > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  {product.stock} units currently available
                </p>
              )}

            </div>

            {/* Description */}
            <div className="mt-7">

              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
                Description
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-400">
                {product.description ||
                  `Experience premium quality and thoughtful design with the ${product.name}. Built for everyday use with a focus on comfort, reliability and modern style.`}
              </p>

            </div>

            {/* Quantity */}
            <div className="mt-8">

              <p className="mb-3 text-sm font-medium text-gray-200">
                Quantity
              </p>

              <div className="flex w-fit items-center overflow-hidden rounded-xl border border-[#292929] bg-[#151515]">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="flex h-12 w-12 items-center justify-center text-gray-400 transition hover:bg-[#0B0B0B] hover:text-[#C9A227] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <FiMinus size={16} />
                </button>

                <span className="flex h-12 min-w-14 items-center justify-center border-x border-[#292929] text-sm font-semibold text-white">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="flex h-12 w-12 items-center justify-center text-gray-400 transition hover:bg-[#0B0B0B] hover:text-[#C9A227] disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={16} />
                </button>

              </div>

            </div>

            {/* Buttons */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-medium transition ${
                  isAdded
                    ? "border border-green-500 bg-green-500/10 text-green-400"
                    : "border border-[#C9A227] bg-transparent text-[#C9A227] hover:bg-[#C9A227] hover:text-black"
                } disabled:cursor-not-allowed disabled:border-gray-700 disabled:text-gray-600`}
              >
                {isAdded ? (
                  <>
                    <FiCheck size={18} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <FiShoppingCart size={18} />
                    Add to Cart
                  </>
                )}
              </button>

              {/* Buy Now */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex items-center justify-center rounded-xl bg-[#C9A227] px-5 py-4 text-sm font-medium text-black transition hover:bg-[#E2C45A] disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500"
              >
                Buy Now
              </button>

            </div>

            {/* View Cart after adding */}
            {isAdded && (
              <Link
                to="/cart"
                className="mt-3 flex w-full items-center justify-center rounded-xl border border-[#292929] bg-[#151515] px-5 py-3.5 text-sm font-medium text-gray-300 transition hover:border-[#C9A227] hover:text-[#C9A227]"
              >
                View Cart
              </Link>
            )}

            {/* Product Information */}
            <div className="mt-8 border-t border-[#292929] pt-7">

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-600">
                    Category
                  </p>

                  <p className="mt-1 text-sm text-gray-300">
                    {product.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-600">
                    Product ID
                  </p>

                  <p className="mt-1 text-sm text-gray-300">
                    #{product.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-600">
                    Rating
                  </p>

                  <p className="mt-1 text-sm text-gray-300">
                    {product.rating} / 5
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-600">
                    Availability
                  </p>

                  <p className="mt-1 text-sm text-gray-300">
                    {product.stock > 0
                      ? "Available"
                      : "Out of stock"}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Back to Shop */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 xl:px-12">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-[#C9A227]"
        >
          <FiArrowLeft size={16} />
          Continue shopping
        </Link>
      </section>

    </main>
  );
};

export default ProductDetails;
