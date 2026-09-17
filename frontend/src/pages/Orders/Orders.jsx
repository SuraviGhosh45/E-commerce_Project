import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCalendar,
  FiChevronRight,
  FiPackage,
  FiShoppingBag,
} from "react-icons/fi";
import api from "../../services/api";

const Orders = () => {
  const {
    isAuthenticated,
    isAdmin,
  } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // ADMIN SHOULD NEVER USE CUSTOMER MY ORDERS PAGE
  // --------------------------------------------------

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/orders" replace />;
  }

  // --------------------------------------------------
  // FETCH CUSTOMER ORDERS
  // --------------------------------------------------

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || isAdmin) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get("/orders/myorders");

        const backendOrders =
          response.data?.orders || [];

        const formattedOrders =
          backendOrders.map((order) => ({
            ...order,
            id: order._id,

            date: order.createdAt
              ? new Date(
                  order.createdAt
                ).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "—",

            items: Array.isArray(order.items)
              ? order.items.reduce(
                  (total, item) =>
                    total +
                    Number(item.quantity || 0),
                  0
                )
              : 0,

            total:
              Number(order.totalAmount || 0),

            status:
              order.status || "Pending",

            statusType: String(
              order.status || "Pending"
            ).toLowerCase(),
          }));

        setOrders(formattedOrders);
      } catch (error) {
        console.error(
          "FETCH MY ORDERS ERROR:",
          error
        );

        if (error.response?.status === 404) {
          setOrders([]);
          setError("");
        } else {
          setError(
            error.response?.data?.message ||
              "Unable to load your orders."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, isAdmin]);

  // --------------------------------------------------
  // ACTIVE ORDERS
  // --------------------------------------------------

  const activeOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.status === "Processing" ||
        order.status === "Shipped" ||
        order.status === "Pending"
    );
  }, [orders]);

  const latestOrder = orders[0];

  // --------------------------------------------------
  // STATUS STYLES
  // --------------------------------------------------

  const getStatusClasses = (status) => {
    switch (status) {
      case "Delivered":
        return "border-green-900/40 bg-green-950/30 text-green-400";

      case "Shipped":
        return "border-blue-900/40 bg-blue-950/30 text-blue-400";

      case "Processing":
        return "border-[#C9A227]/30 bg-[#C9A227]/10 text-[#E2C45A]";

      case "Pending":
        return "border-yellow-900/40 bg-yellow-950/20 text-yellow-400";

      case "Cancelled":
        return "border-red-900/40 bg-red-950/30 text-red-400";

      case "Returned":
        return "border-orange-900/40 bg-orange-950/30 text-orange-400";

      default:
        return "border-[#292929] bg-[#111111] text-gray-400";
    }
  };

  // --------------------------------------------------
  // NOT AUTHENTICATED
  // --------------------------------------------------

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] px-5 py-20 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#292929] bg-[#151515] p-8 text-center">
          <h1 className="text-2xl font-semibold">
            Login required
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Sign in to view your orders.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-flex rounded-xl bg-[#C9A227] px-6 py-3 text-sm font-medium text-black"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] px-5 py-20 text-[#F5F5F5]">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#292929] bg-[#151515] p-10 text-center sm:p-16">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#292929] border-t-[#C9A227]" />

          <p className="mt-5 text-sm text-gray-500">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
      {/* HEADER */}
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
                View your purchases, track active
                orders and access your order details.
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

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 xl:px-12">
        {error && (
          <div className="mb-6 rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* SUMMARY */}
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
                  {activeOrders.length}
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
                  {latestOrder?.date ||
                    "No orders yet"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER HISTORY */}
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
              {orders.length}{" "}
              {orders.length === 1
                ? "order"
                : "orders"}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-[#292929] bg-[#111111] p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#151515] text-[#C9A227]">
                <FiShoppingBag size={22} />
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                No orders yet
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Your successful purchases will
                appear here.
              </p>

              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
              >
                Start Shopping
                <FiArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-2xl border border-[#292929] bg-[#111111] p-5 transition hover:border-[#C9A227]/50 sm:p-6"
                >
                  {/* DESKTOP */}
                  <div className="hidden items-center gap-6 md:flex">
                    <div className="min-w-[190px]">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                        Order ID
                      </p>

                      <p className="mt-2 break-all text-sm font-semibold text-white">
                        #{order.id}
                      </p>
                    </div>

                    <div className="min-w-[150px]">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                        Date
                      </p>

                      <p className="mt-2 text-sm text-gray-300">
                        {order.date}
                      </p>
                    </div>

                    <div className="min-w-[90px]">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                        Items
                      </p>

                      <p className="mt-2 text-sm text-gray-300">
                        {order.items}{" "}
                        {order.items === 1
                          ? "item"
                          : "items"}
                      </p>
                    </div>

                    <div className="min-w-[110px]">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                        Total
                      </p>

                      <p className="mt-2 text-sm font-semibold text-[#C9A227]">
                        ₹{order.total.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                        Status
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <Link
                      to={`/orders/${order.id}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#292929] text-gray-400 transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-black"
                      aria-label={`View order ${order.id}`}
                    >
                      <FiChevronRight size={18} />
                    </Link>
                  </div>

                  {/* MOBILE */}
                  <div className="md:hidden">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                          Order ID
                        </p>

                        <p className="mt-2 break-all text-sm font-semibold">
                          #{order.id}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium ${getStatusClasses(
                          order.status
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
                          {order.items === 1
                            ? "item"
                            : "items"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600">
                          Total
                        </p>

                        <p className="mt-2 text-sm font-semibold text-[#C9A227]">
                          ₹{order.total.toFixed(2)}
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
          )}
        </div>
      </section>
    </main>
  );
};

export default Orders;