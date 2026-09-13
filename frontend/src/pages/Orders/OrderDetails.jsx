
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiCreditCard,
  FiMail,
  FiPhone,
} from "react-icons/fi";

const OrderDetails = () => {
  const { id } = useParams();

  // Frontend-only dummy order
  const order = {
    id: id || "VD-2026-00124",
    date: "September 14, 2026",
    status: "Delivered",
    paymentMethod: "Razorpay",
    paymentStatus: "Paid",

    customer: {
      name: "Suravi Ghosh",
      email: "suravi@example.com",
      phone: "+91 98765 43210",
    },

    shippingAddress: {
      address: "123 Main Street",
      city: "Kolkata",
      state: "West Bengal",
      postalCode: "700001",
      country: "India",
    },

    items: [
      {
        id: 1,
        name: "Premium Headphones",
        category: "Electronics",
        price: 129,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80",
      },
      {
        id: 2,
        name: "Minimal Watch",
        category: "Accessories",
        price: 89,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80",
      },
    ],

    subtotal: 307,
    shipping: 0,
    total: 307,
  };

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">

      {/* ================= HEADER ================= */}
      <section className="border-b border-[#292929] bg-black">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10 xl:px-12">

          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#C9A227]"
          >
            <FiArrowLeft size={16} />
            Back to Orders
          </Link>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-sm">
                Order details
              </p>

              <h1 className="mt-3 break-all text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                #{order.id}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Placed on {order.date}
              </p>
            </div>

            <span className="w-fit rounded-full border border-green-900/40 bg-green-950/30 px-4 py-2 text-xs font-medium text-green-400">
              {order.status}
            </span>

          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 xl:px-12">

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">

          {/* LEFT */}
          <div className="space-y-6">

            {/* ================= ORDER STATUS ================= */}
            <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    Order status
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    Track the progress of your order.
                  </p>
                </div>

                <FiTruck
                  size={22}
                  className="text-[#C9A227]"
                />
              </div>

              {/* Desktop status line */}
              <div className="mt-8 hidden sm:flex items-center">

                <div className="flex flex-1 items-center">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227] text-black">
                    <FiCheck size={18} />
                  </div>

                  <div className="h-px flex-1 bg-[#C9A227]" />

                </div>

                <div className="flex flex-1 items-center">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227] text-black">
                    <FiCheck size={18} />
                  </div>

                  <div className="h-px flex-1 bg-[#C9A227]" />

                </div>

                <div className="flex flex-1 items-center">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227] text-black">
                    <FiCheck size={18} />
                  </div>

                  <div className="h-px flex-1 bg-[#C9A227]" />

                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227] text-black">
                  <FiCheck size={18} />
                </div>

              </div>

              {/* Mobile status */}
              <div className="mt-7 space-y-5 sm:hidden">

                {[
                  "Order placed",
                  "Processing",
                  "Shipped",
                  "Delivered",
                ].map((status) => (
                  <div
                    key={status}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C9A227] text-black">
                      <FiCheck size={15} />
                    </div>

                    <span className="text-sm text-gray-300">
                      {status}
                    </span>
                  </div>
                ))}

              </div>

              <div className="mt-5 hidden justify-between text-xs text-gray-500 sm:flex">
                <span>Order placed</span>
                <span>Processing</span>
                <span>Shipped</span>
                <span>Delivered</span>
              </div>

            </section>

            {/* ================= ORDER ITEMS ================= */}
            <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">

              <div className="flex items-center justify-between border-b border-[#292929] pb-5">

                <div>
                  <h2 className="text-lg font-semibold">
                    Items in your order
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    {order.items.length} different products
                  </p>
                </div>

                <FiPackage
                  size={21}
                  className="text-[#C9A227]"
                />

              </div>

              <div className="mt-5 space-y-4">

                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-xl border border-[#292929] bg-[#0B0B0B] p-4"
                  >

                    <Link
                      to={`/products/${item.id}`}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#151515] sm:h-28 sm:w-28"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition hover:scale-105"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">

                      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600 sm:text-xs">
                        {item.category}
                      </p>

                      <Link
                        to={`/products/${item.id}`}
                        className="mt-1 block text-sm font-semibold transition hover:text-[#C9A227] sm:text-base"
                      >
                        {item.name}
                      </Link>

                      <div className="mt-3 flex flex-wrap items-center gap-3">

                        <span className="text-xs text-gray-500">
                          Quantity: {item.quantity}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-gray-700" />

                        <span className="text-sm font-medium text-[#C9A227]">
                          ${item.price}
                        </span>

                      </div>

                      <p className="mt-2 text-sm font-semibold text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

            </section>

            {/* ================= SHIPPING + CUSTOMER ================= */}
            <div className="grid gap-6 md:grid-cols-2">

              {/* Shipping */}
              <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                    <FiMapPin size={17} />
                  </div>

                  <h2 className="text-base font-semibold">
                    Shipping address
                  </h2>
                </div>

                <div className="mt-5 text-sm leading-6 text-gray-400">
                  <p className="font-medium text-gray-200">
                    {order.customer.name}
                  </p>

                  <p>{order.shippingAddress.address}</p>

                  <p>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}
                  </p>

                  <p>
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </p>
                </div>

              </section>

              {/* Customer */}
              <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                    <FiMail size={17} />
                  </div>

                  <h2 className="text-base font-semibold">
                    Contact details
                  </h2>
                </div>

                <div className="mt-5 space-y-3 text-sm text-gray-400">

                  <p>
                    <span className="text-gray-600">
                      Email:
                    </span>{" "}
                    {order.customer.email}
                  </p>

                  <p className="flex items-center gap-2">
                    <FiPhone size={14} className="text-[#C9A227]" />
                    {order.customer.phone}
                  </p>

                </div>

              </section>

            </div>

            {/* ================= PAYMENT ================= */}
            <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                  <FiCreditCard size={17} />
                </div>

                <div>
                  <h2 className="text-base font-semibold">
                    Payment information
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Payment details for this order.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                    Payment method
                  </p>

                  <p className="mt-2 text-sm font-medium text-gray-200">
                    {order.paymentMethod}
                  </p>
                </div>

                <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                    Payment status
                  </p>

                  <p className="mt-2 text-sm font-medium text-green-400">
                    {order.paymentStatus}
                  </p>
                </div>

              </div>

            </section>

          </div>

          {/* ================= SUMMARY ================= */}
          <aside className="h-fit rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6 lg:sticky lg:top-24">

            <h2 className="text-lg font-semibold">
              Order summary
            </h2>

            <div className="mt-6 space-y-4 border-b border-[#292929] pb-6">

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="text-gray-200">
                  ${order.subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Shipping
                </span>

                <span className="text-gray-200">
                  {order.shipping === 0
                    ? "Free"
                    : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>

            </div>

            <div className="mt-6 flex items-center justify-between">

              <span className="font-medium">
                Total
              </span>

              <span className="text-2xl font-semibold text-[#C9A227]">
                ${order.total.toFixed(2)}
              </span>

            </div>

            <Link
              to="/shop"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-[#C9A227] px-5 py-3.5 text-sm font-medium text-[#C9A227] transition hover:bg-[#C9A227] hover:text-black"
            >
              Continue Shopping
            </Link>

          </aside>

        </div>
      </section>

    </main>
  );
};

export default OrderDetails;
