import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2,
  FiArrowRight,
  FiTruck,
  FiShield,
} from "react-icons/fi";

import { useCart } from "../../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    cartTotal,
    isCartEmpty,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const shippingCost = cartTotal >= 100 ? 0 : 10;
  const finalTotal = cartTotal + shippingCost;

  // Empty cart
  if (isCartEmpty) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] px-5 py-16 text-[#F5F5F5] sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#292929] bg-[#151515] text-[#C9A227]">
            <FiShoppingBag size={30} />
          </div>

          <p className="mt-7 text-xs font-medium uppercase tracking-[0.25em] text-[#C9A227]">
            Your shopping bag
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your cart is empty.
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500">
            Looks like you haven't added anything to
            your cart yet. Discover something you'll love.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-6 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
          >
            Start Shopping
            <FiArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
      {/* Header */}
      <section className="border-b border-[#292929] bg-black">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 xl:px-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-sm">
                Shopping bag
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Your cart
              </h1>
            </div>

            <p className="text-sm text-gray-500">
              {cartCount}{" "}
              {cartCount === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 xl:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
          {/* Cart Items */}
          <div>
            <div className="flex items-center justify-between border-b border-[#292929] pb-5">
              <h2 className="text-lg font-semibold">
                Cart items
              </h2>

              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-gray-500 transition hover:text-red-400"
              >
                Clear cart
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#292929] bg-[#111111] p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Product image */}
                    <Link
                      to={`/products/${item.id}`}
                      className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-[#151515] sm:h-32 sm:w-32"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </Link>

                    {/* Product info */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600 sm:text-xs">
                              {item.category}
                            </p>

                            <Link
                              to={`/products/${item.id}`}
                              className="mt-1 block truncate text-base font-semibold transition hover:text-[#C9A227] sm:text-lg"
                            >
                              {item.name}
                            </Link>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            aria-label={`Remove ${item.name}`}
                            className="shrink-0 text-gray-600 transition hover:text-red-400"
                          >
                            <FiTrash2 size={17} />
                          </button>
                        </div>

                        <p className="mt-3 text-lg font-semibold text-[#C9A227]">
                          ₹{Number(item.price || 0).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity + subtotal */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center overflow-hidden rounded-xl border border-[#292929] bg-[#0B0B0B]">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(item.id)
                            }
                            className="flex h-10 w-10 items-center justify-center text-gray-400 transition hover:text-[#C9A227]"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={15} />
                          </button>

                          <span className="flex h-10 min-w-10 items-center justify-center border-x border-[#292929] text-sm font-medium">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(item.id)
                            }
                            disabled={
                              item.quantity >= item.stock
                            }
                            className="flex h-10 w-10 items-center justify-center text-gray-400 transition hover:text-[#C9A227] disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={15} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-600">
                            Subtotal
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-200">
                            ₹
                            {(
                              Number(item.price || 0) *
                              Number(item.quantity || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#C9A227]"
              >
                <FiArrowLeft size={16} />
                Continue shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <aside className="h-fit rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">
              Order summary
            </h2>

            <div className="mt-6 space-y-4 border-b border-[#292929] pb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-medium text-gray-200">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Shipping
                </span>

                <span className="font-medium text-gray-200">
                  {shippingCost === 0
                    ? "Free"
                    : `₹${shippingCost.toFixed(2)}`}
                </span>
              </div>

              {shippingCost === 0 && (
                <p className="text-xs text-[#C9A227]">
                  You unlocked free shipping.
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="font-medium">
                Total
              </span>

              <span className="text-2xl font-semibold text-[#C9A227]">
                ₹{finalTotal.toFixed(2)}
              </span>
            </div>

            {/* Checkout */}
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-4 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
            >
              Proceed to Checkout
              <FiArrowRight size={17} />
            </button>

            {/* Benefits */}
            <div className="mt-7 space-y-4 border-t border-[#292929] pt-6">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                  <FiTruck size={16} />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-200">
                    Fast Delivery
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-gray-600">
                    Reliable delivery on eligible orders.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                  <FiShield size={16} />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-200">
                    Secure Checkout
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-gray-600">
                    Your payment information stays protected.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Cart;