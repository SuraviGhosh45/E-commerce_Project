
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiTruck,
  FiShield,
  FiCreditCard,
} from "react-icons/fi";

import { useCart } from "../../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    cartCount,
    isCartEmpty,
  } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const shippingCost = cartTotal >= 100 ? 0 : 10;
  const finalTotal = cartTotal + shippingCost;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend-only for now.
    // Later this will create the real order and initiate payment.

    console.log("Checkout submitted:", {
      customer: formData,
      paymentMethod,
      items: cartItems,
      total: finalTotal,
    });

    navigate("/payment", {
      state: {
        customer: formData,
        paymentMethod,
        items: cartItems,
        total: finalTotal,
      },
    });
  };

  // Empty cart
  if (isCartEmpty) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#292929] bg-[#151515] p-8 text-center sm:p-12">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
            <FiCreditCard size={26} />
          </div>

          <h1 className="mt-6 text-2xl font-semibold sm:text-3xl">
            Your cart is empty
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            Add some products to your cart before continuing to checkout.
          </p>

          <Link
            to="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-6 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
          >
            Continue Shopping
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

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#C9A227]"
          >
            <FiArrowLeft size={16} />
            Back to Cart
          </Link>

          <div className="mt-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-sm">
              Secure checkout
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Complete your order.
            </h1>

            <p className="mt-4 text-sm leading-7 text-gray-400 sm:text-base">
              Enter your delivery details and choose your preferred payment
              method.
            </p>
          </div>

        </div>
      </section>

      {/* Checkout content */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 xl:px-12">

        <form onSubmit={handleSubmit}>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">

            {/* LEFT */}
            <div className="space-y-6">

              {/* Contact Information */}
              <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                    <FiUser size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">
                      Contact information
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                      We'll use these details to send your order updates.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">

                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="fullName"
                      className="mb-2 block text-sm font-medium text-gray-200"
                    >
                      Full name
                    </label>

                    <div className="relative">
                      <FiUser
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                      />

                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        required
                        className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-200"
                    >
                      Email
                    </label>

                    <div className="relative">
                      <FiMail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-gray-200"
                    >
                      Phone number
                    </label>

                    <div className="relative">
                      <FiPhone
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                      />

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        autoComplete="tel"
                        required
                        className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
                      />
                    </div>
                  </div>
                </div>

              </section>

              {/* Shipping Address */}
              <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                    <FiMapPin size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">
                      Shipping address
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">

                  {/* Address */}
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-medium text-gray-200"
                    >
                      Address
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House number, street, apartment..."
                      rows={3}
                      autoComplete="street-address"
                      required
                      className="w-full resize-none rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
                    />
                  </div>

                  {/* City / State */}
                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label
                        htmlFor="city"
                        className="mb-2 block text-sm font-medium text-gray-200"
                      >
                        City
                      </label>

                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        autoComplete="address-level2"
                        required
                        className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="state"
                        className="mb-2 block text-sm font-medium text-gray-200"
                      >
                        State
                      </label>

                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        autoComplete="address-level1"
                        required
                        className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
                      />
                    </div>

                  </div>

                  {/* Postal / Country */}
                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label
                        htmlFor="postalCode"
                        className="mb-2 block text-sm font-medium text-gray-200"
                      >
                        Postal code
                      </label>

                      <input
                        id="postalCode"
                        name="postalCode"
                        type="text"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Postal code"
                        autoComplete="postal-code"
                        required
                        className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="country"
                        className="mb-2 block text-sm font-medium text-gray-200"
                      >
                        Country
                      </label>

                      <input
                        id="country"
                        name="country"
                        type="text"
                        value={formData.country}
                        onChange={handleChange}
                        autoComplete="country-name"
                        required
                        className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/20"
                      />
                    </div>

                  </div>

                </div>
              </section>

              {/* Payment method */}
              <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                    <FiCreditCard size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">
                      Payment method
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                      Choose how you'd like to pay.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">

                  {/* Razorpay */}
                  <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-[#292929] bg-[#0B0B0B] p-4 transition has-[:checked]:border-[#C9A227]">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 accent-[#C9A227]"
                    />

                    <div className="flex flex-1 items-center justify-between gap-4">

                      <div>
                        <p className="text-sm font-medium text-white">
                          Razorpay
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          UPI, cards, wallets and net banking
                        </p>
                      </div>

                      <span className="rounded-md border border-[#292929] px-2 py-1 text-[10px] uppercase tracking-wider text-[#C9A227]">
                        Online
                      </span>

                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-[#292929] bg-[#0B0B0B] p-4 transition has-[:checked]:border-[#C9A227]">

                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 accent-[#C9A227]"
                    />

                    <div className="flex flex-1 items-center justify-between gap-4">

                      <div>
                        <p className="text-sm font-medium text-white">
                          Cash on Delivery
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          Pay when your order arrives
                        </p>
                      </div>

                      <span className="rounded-md border border-[#292929] px-2 py-1 text-[10px] uppercase tracking-wider text-gray-500">
                        COD
                      </span>

                    </div>
                  </label>

                </div>
              </section>

            </div>

            {/* RIGHT ORDER SUMMARY */}
            <aside className="h-fit rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6 lg:sticky lg:top-24">

              <h2 className="text-lg font-semibold">
                Order summary
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </p>

              {/* Items */}
              <div className="mt-6 max-h-[360px] space-y-4 overflow-y-auto pr-1">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3"
                  >

                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#292929] bg-[#0B0B0B]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-medium text-gray-200">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#C9A227]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                  </div>
                ))}

              </div>

              <div className="mt-6 space-y-4 border-t border-[#292929] pt-6">

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="text-gray-200">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span className="text-gray-200">
                    {shippingCost === 0
                      ? "Free"
                      : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                {shippingCost === 0 && (
                  <p className="text-xs text-[#C9A227]">
                    Free shipping applied.
                  </p>
                )}

              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#292929] pt-6">

                <span className="font-medium">
                  Total
                </span>

                <span className="text-2xl font-semibold text-[#C9A227]">
                  ${finalTotal.toFixed(2)}
                </span>

              </div>

              <button
                type="submit"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-4 text-sm font-medium text-black transition hover:bg-[#E2C45A] active:scale-[0.99]"
              >
                Continue to Payment
                <FiArrowRight size={17} />
              </button>

              <div className="mt-6 border-t border-[#292929] pt-5">

                <div className="flex items-center gap-3">
                  <FiTruck size={17} className="text-[#C9A227]" />

                  <p className="text-xs leading-5 text-gray-500">
                    Free shipping on orders over $100.
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <FiShield size={17} className="text-[#C9A227]" />

                  <p className="text-xs leading-5 text-gray-500">
                    Your information is kept secure.
                  </p>
                </div>

              </div>

            </aside>

          </div>
        </form>
      </section>

    </main>
  );
};

export default Checkout;

