import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiCreditCard,
  FiMail,
  FiAlertCircle,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

const OrderDetails = () => {
  const { id } = useParams();
  const location = useLocation();

  const { isAuthenticated, isAdmin } = useAuth();

  const isAdminOrderPage =
    isAdmin &&
    location.pathname.startsWith(
      "/admin/orders/"
    );

  const backPath = isAdminOrderPage
    ? "/admin/orders"
    : "/orders";

  const pageLabel = isAdminOrderPage
    ? "Admin order details"
    : "Order details";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // FETCH ORDER
  // ==================================================

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated || !id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/orders/${id}`
        );

        if (!response.data?.order) {
          throw new Error("Order not found.");
        }

        setOrder(response.data.order);
      } catch (error) {
        console.error(
          "FETCH ORDER DETAILS ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, isAuthenticated]);

  // ==================================================
  // FORMATTED DATE
  // ==================================================

  const formattedDate = useMemo(() => {
    if (!order?.createdAt) {
      return "—";
    }

    return new Date(
      order.createdAt
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [order]);

  // ==================================================
  // TOTAL ITEMS
  // ==================================================

  const totalItems = useMemo(() => {
    return (
      order?.items?.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      ) || 0
    );
  }, [order]);

  // ==================================================
  // SUBTOTAL
  // ==================================================

  const subtotal = useMemo(() => {
    return (
      order?.items?.reduce(
        (total, item) =>
          total +
          Number(item.price || 0) *
            Number(item.quantity || 0),
        0
      ) || 0
    );
  }, [order]);

  // ==================================================
  // SHIPPING
  // ==================================================

  const shipping = Math.max(
    0,
    Number(order?.totalAmount || 0) - subtotal
  );

  // ==================================================
  // STATUS
  // ==================================================

  const getStatusIndex = (status) => {
    switch (status) {
      case "Pending":
        return 0;

      case "Processing":
        return 1;

      case "Shipped":
        return 2;

      case "Delivered":
        return 3;

      default:
        return -1;
    }
  };

  const currentStatusIndex = getStatusIndex(
    order?.status
  );

  const statuses = [
    "Order placed",
    "Processing",
    "Shipped",
    "Delivered",
  ];

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

  // ==================================================
  // NOT AUTHENTICATED
  // ==================================================

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] px-5 py-20 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#292929] bg-[#151515] p-8 text-center">
          <h1 className="text-2xl font-semibold">
            Login required
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Sign in to view this order.
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

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] px-5 py-20 text-[#F5F5F5]">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#292929] bg-[#151515] p-10 text-center sm:p-16">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#292929] border-t-[#C9A227]" />

          <p className="mt-5 text-sm text-gray-500">
            Loading order details...
          </p>
        </div>
      </main>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] px-5 py-20 text-white">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#292929] bg-[#151515] p-8 text-center sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
            <FiAlertCircle size={26} />
          </div>

          <h1 className="mt-6 text-2xl font-semibold sm:text-3xl">
            Order not found
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            {error || "This order is unavailable."}
          </p>

          <Link
            to={backPath}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-6 py-3.5 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
          >
            <FiArrowLeft size={16} />

            {isAdminOrderPage
              ? "Back to Order Management"
              : "Back to Orders"}
          </Link>
        </div>
      </main>
    );
  }

  // ==================================================
  // CUSTOMER DETAILS
  // ==================================================

  const customerName =
    order.user?.name ||
    order.address?.fullname ||
    "Customer";

  const customerEmail =
    order.user?.email || "—";

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="border-b border-[#292929] bg-black">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10 xl:px-12">
          <Link
            to={backPath}
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#C9A227]"
          >
            <FiArrowLeft size={16} />

            {isAdminOrderPage
              ? "Back to Order Management"
              : "Back to Orders"}
          </Link>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-sm">
                {pageLabel}
              </p>

              <h1 className="mt-3 break-all text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                #{order._id}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Placed on {formattedDate}
              </p>
            </div>

            <span
              className={`w-fit rounded-full border px-4 py-2 text-xs font-medium ${getStatusClasses(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-14 xl:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            {/* =================================================
                ORDER STATUS
            ================================================= */}

            <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    Order status
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    {isAdminOrderPage
                      ? "Monitor the current order progress."
                      : "Track the progress of your order."}
                  </p>
                </div>

                <FiTruck
                  size={22}
                  className="text-[#C9A227]"
                />
              </div>

              {order.status === "Cancelled" ||
              order.status === "Returned" ? (
                <div className="mt-7">
                  <span
                    className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              ) : (
                <>
                  {/* Desktop */}
                  <div className="mt-8 hidden items-center sm:flex">
                    {statuses.map(
                      (status, index) => {
                        const completed =
                          index <=
                          currentStatusIndex;

                        const isLast =
                          index ===
                          statuses.length - 1;

                        return (
                          <div
                            key={status}
                            className="flex flex-1 items-center"
                          >
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                completed
                                  ? "bg-[#C9A227] text-black"
                                  : "border border-[#292929] bg-[#0B0B0B] text-gray-600"
                              }`}
                            >
                              {completed ? (
                                <FiCheck size={18} />
                              ) : (
                                index + 1
                              )}
                            </div>

                            {!isLast && (
                              <div
                                className={`h-px flex-1 ${
                                  index <
                                  currentStatusIndex
                                    ? "bg-[#C9A227]"
                                    : "bg-[#292929]"
                                }`}
                              />
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="mt-7 space-y-5 sm:hidden">
                    {statuses.map(
                      (status, index) => {
                        const completed =
                          index <=
                          currentStatusIndex;

                        return (
                          <div
                            key={status}
                            className="flex items-center gap-3"
                          >
                            <div
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                completed
                                  ? "bg-[#C9A227] text-black"
                                  : "border border-[#292929] bg-[#0B0B0B] text-gray-600"
                              }`}
                            >
                              {completed ? (
                                <FiCheck size={15} />
                              ) : (
                                index + 1
                              )}
                            </div>

                            <span
                              className={`text-sm ${
                                completed
                                  ? "text-gray-200"
                                  : "text-gray-600"
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>

                  <div className="mt-5 hidden justify-between text-xs text-gray-500 sm:flex">
                    {statuses.map((status) => (
                      <span key={status}>
                        {status}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </section>

            {/* =================================================
                ITEMS
            ================================================= */}

            <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-[#292929] pb-5">
                <div>
                  <h2 className="text-lg font-semibold">
                    Items in this order
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "item"
                      : "items"}
                  </p>
                </div>

                <FiPackage
                  size={21}
                  className="text-[#C9A227]"
                />
              </div>

              <div className="mt-5 space-y-4">
                {order.items.map((item, index) => {
                  const product =
                    item.productId;

                  const productId =
                    typeof product === "object"
                      ? product?._id
                      : product;

                  const productName =
                    typeof product === "object"
                      ? product?.name
                      : "Product";

                  const productCategory =
                    typeof product === "object"
                      ? product?.category
                      : "Product";

                  const productImage =
                    productId
                      ? `${API_BASE_URL}/products/${productId}/image`
                      : "";

                  return (
                    <div
                      key={`${productId}-${index}`}
                      className="flex gap-4 rounded-xl border border-[#292929] bg-[#0B0B0B] p-4"
                    >
                      <Link
                        to={
                          isAdminOrderPage
                            ? "#"
                            : `/products/${productId}`
                        }
                        onClick={(e) => {
                          if (isAdminOrderPage) {
                            e.preventDefault();
                          }
                        }}
                        className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#151515] sm:h-28 sm:w-28"
                      >
                        {productImage && (
                          <img
                            src={productImage}
                            alt={productName}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-600 sm:text-xs">
                          {productCategory}
                        </p>

                        {isAdminOrderPage ? (
                          <p className="mt-1 text-sm font-semibold sm:text-base">
                            {productName}
                          </p>
                        ) : (
                          <Link
                            to={`/products/${productId}`}
                            className="mt-1 block text-sm font-semibold transition hover:text-[#C9A227] sm:text-base"
                          >
                            {productName}
                          </Link>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span className="text-xs text-gray-500">
                            Quantity:{" "}
                            {item.quantity}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-gray-700" />

                          <span className="text-sm font-medium text-[#C9A227]">
                            ₹
                            {Number(
                              item.price || 0
                            ).toFixed(2)}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-white">
                          ₹
                          {(
                            Number(
                              item.price || 0
                            ) *
                            Number(
                              item.quantity || 0
                            )
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* =================================================
                ADDRESS + CUSTOMER
            ================================================= */}

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
                    {order.address?.fullname}
                  </p>

                  <p>
                    {order.address?.street}
                  </p>

                  <p>
                    {order.address?.city},{" "}
                    {order.address?.state}
                  </p>

                  <p>
                    {order.address?.zipCode},{" "}
                    {order.address?.country}
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                    <FiMail size={17} />
                  </div>

                  <h2 className="text-base font-semibold">
                    Customer details
                  </h2>
                </div>

                <div className="mt-5 space-y-3 text-sm text-gray-400">
                  <p>
                    <span className="text-gray-600">
                      Name:
                    </span>{" "}
                    {customerName}
                  </p>

                  <p>
                    <span className="text-gray-600">
                      Email:
                    </span>{" "}
                    {customerEmail}
                  </p>
                </div>
              </section>
            </div>

            {/* =================================================
                PAYMENT
            ================================================= */}

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
                    Razorpay
                  </p>
                </div>

                <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-4">
                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                    Payment status
                  </p>

                  <p className="mt-2 text-sm font-medium text-green-400">
                    Paid
                  </p>
                </div>

                <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-4 sm:col-span-2">
                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                    Payment ID
                  </p>

                  <p className="mt-2 break-all text-sm font-medium text-gray-200">
                    {order.paymentId || "—"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

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
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Shipping
                </span>

                <span className="text-gray-200">
                  {shipping === 0
                    ? "Free"
                    : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="font-medium">
                Total
              </span>

              <span className="text-2xl font-semibold text-[#C9A227]">
                ₹
                {Number(
                  order.totalAmount || 0
                ).toFixed(2)}
              </span>
            </div>

            {isAdminOrderPage ? (
              <Link
                to="/admin/orders"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-[#C9A227] px-5 py-3.5 text-sm font-medium text-[#C9A227] transition hover:bg-[#C9A227] hover:text-black"
              >
                <FiArrowLeft size={16} />
                Back to Order Management
              </Link>
            ) : (
              <Link
                to="/shop"
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-[#C9A227] px-5 py-3.5 text-sm font-medium text-[#C9A227] transition hover:bg-[#C9A227] hover:text-black"
              >
                Continue Shopping
              </Link>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
};

export default OrderDetails;