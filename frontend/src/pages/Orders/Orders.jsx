
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiChevronRight,
  FiPackage,
  FiShoppingBag,
} from "react-icons/fi";

const Orders = () => {
  // Frontend-only dummy orders
  const orders = [
    {
      id: "VD-2026-00124",
      date: "September 14, 2026",
      items: 3,
      total: 307,
      status: "Delivered",
      statusType: "delivered",
    },
    {
      id: "VD-2026-00118",
      date: "September 10, 2026",
      items: 2,
      total: 249,
      status: "Shipped",
      statusType: "shipped",
    },
    {
      id: "VD-2026-00107",
      date: "September 05, 2026",
      items: 1,
      total: 129,
      status: "Processing",
      statusType: "processing",
    },
    {
      id: "VD-2026-00096",
      date: "August 29, 2026",
      items: 4,
      total: 438,
      status: "Delivered",
      statusType: "delivered",
    },
    {
      id: "VD-2026-00082",
      date: "August 20, 2026",
      items: 2,
      total: 199,
      status: "Cancelled",
      statusType: "cancelled",
    },
  ];

  const getStatusClasses = (statusType) => {
    switch (statusType) {
      case "delivered":
        return "border-green-900/40 bg-green-950/30 text-green-400";

      case "shipped":
        return "border-blue-900/40 bg-blue-950/30 text-blue-400";

      case "processing":
        return "border-[#C9A227]/30 bg-[#C9A227]/10 text-[#E2C45A]";

      case "cancelled":
        return "border-red-900/40 bg-red-950/30 text-red-400";

      default:
        return "border-[#292929] bg-[#111111] text-gray-400";
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">

      {/* ================= HEADER ================= */}
      <section className="border-b border-[#292929] bg-black">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 xl:px-12">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-sm">
                Account
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                My orders
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
                View your previous purchases, track active orders and access
                your order details.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
            >
              Continue Shopping
              <FiArrowRight size={16} />
            </Link>

          </div>
        </div>
      </section>

      {/* ================= ORDERS ================= */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 xl:px-12">

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                <FiShoppingBag size={18} />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Total Orders
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {orders.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                <FiPackage size={18} />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Active Orders
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {
                    orders.filter(
                      (order) =>
                        order.statusType === "processing" ||
                        order.statusType === "shipped"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                <FiCalendar size={18} />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Latest Order
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-200">
                  {orders[0]?.date}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Order list */}
        <div className="mt-8">

          <div className="flex items-center justify-between border-b border-[#292929] pb-5">
            <div>
              <h2 className="text-lg font-semibold">
                Order history
              </h2>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Your recent purchases
              </p>
            </div>

            <span className="text-xs text-gray-600">
              {orders.length} orders
            </span>
          </div>

          <div className="mt-5 space-y-4">

            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-[#292929] bg-[#111111] p-5 transition hover:border-[#C9A227]/50 sm:p-6"
              >

                {/* Desktop / tablet */}
                <div className="hidden items-center gap-6 md:flex">

                  {/* Order ID */}
                  <div className="min-w-[190px]">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                      Order ID
                    </p>

                    <p className="mt-2 text-sm font-semibold text-white">
                      #{order.id}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="min-w-[150px]">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                      Date
                    </p>

                    <p className="mt-2 text-sm text-gray-300">
                      {order.date}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="min-w-[90px]">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                      Items
                    </p>

                    <p className="mt-2 text-sm text-gray-300">
                      {order.items}{" "}
                      {order.items === 1 ? "item" : "items"}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="min-w-[110px]">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                      Total
                    </p>

                    <p className="mt-2 text-sm font-semibold text-[#C9A227]">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                      Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                        order.statusType
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Action */}
                  <Link
                    to={`/orders/${order.id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#292929] text-gray-400 transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-black"
                    aria-label={`View order ${order.id}`}
                  >
                    <FiChevronRight size={18} />
                  </Link>

                </div>

                {/* Mobile */}
                <div className="md:hidden">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                        Order ID
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        #{order.id}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium ${getStatusClasses(
                        order.statusType
                      )}`}
                    >
                      {order.status}
                    </span>

                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#292929] pt-5">

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                        Date
                      </p>

                      <p className="mt-2 text-xs text-gray-300">
                        {order.date}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                        Items
                      </p>

                      <p className="mt-2 text-xs text-gray-300">
                        {order.items}{" "}
                        {order.items === 1 ? "item" : "items"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                        Total
                      </p>

                      <p className="mt-2 text-sm font-semibold text-[#C9A227]">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>

                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#C9A227] px-4 py-3 text-sm font-medium text-[#C9A227] transition hover:bg-[#C9A227] hover:text-black"
                  >
                    View Order
                    <FiArrowRight size={16} />
                  </Link>

                </div>

              </article>
            ))}

          </div>
        </div>

      </section>
    </main>
  );
};

export default Orders;

