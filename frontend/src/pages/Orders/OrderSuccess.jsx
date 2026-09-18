import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiArrowRight,
  FiPackage,
  FiShoppingBag,
  FiCalendar,
  FiCreditCard,
} from "react-icons/fi";

import { useCart } from "../../context/CartContext";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { clearCart } = useCart();

  const orderData = location.state || {};
  const order = orderData.order;

  const orderId = order?._id || orderData.orderId;

  const paymentMethod = orderData.paymentMethod || "razorpay";

  const items = orderData.items || [];

  const customer = orderData.customer || {};

  const total = Number(
    order?.totalAmount ??
      orderData.total ??
      0
  );

  const orderStatus = order?.status || "Processing";

  const paymentId =
    order?.paymentId ||
    orderData.paymentId ||
    "";

  useEffect(() => {
    if (!orderId) {
      navigate("/orders", {
        replace: true,
      });
      return;
    }

    clearCart();
  }, [orderId, clearCart, navigate]);

  if (!orderId) {
    return null;
  }

  const handleViewOrders = () => {
    navigate("/orders");
  };

  const handleViewOrderDetails = () => {
    navigate(`/orders/${orderId}`);
  };

  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const totalItems = items.reduce(
    (count, item) =>
      count + Number(item.quantity || 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#0B0B0B] text-[#F5F5F5]">
      <section className="border-b border-[#292929] bg-black">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#C9A227] text-black shadow-[0_0_40px_rgba(201,162,39,0.15)] sm:h-24 sm:w-24">
            <FiCheck size={38} strokeWidth={2.5} />
          </div>

          <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A227] sm:text-sm">
            Order confirmed
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Thank you for your order.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
            Your payment was verified and your order has been successfully placed.
          </p>

          <div className="mx-auto mt-8 w-fit rounded-xl border border-[#292929] bg-[#151515] px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600">
              Order ID
            </p>

            <p className="mt-2 break-all text-base font-semibold text-[#C9A227] sm:text-lg">
              #{orderId}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">
              <div className="flex items-center gap-3 border-b border-[#292929] pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                  <FiPackage size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Order overview
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Your purchase has been successfully recorded.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FiCalendar size={14} />

                    <span className="text-[10px] uppercase tracking-wider">
                      Date
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-medium text-gray-200">
                    {orderDate}
                  </p>
                </div>

                <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FiShoppingBag size={14} />

                    <span className="text-[10px] uppercase tracking-wider">
                      Items
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-medium text-gray-200">
                    {totalItems}
                  </p>
                </div>

                <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FiCreditCard size={14} />

                    <span className="text-[10px] uppercase tracking-wider">
                      Payment
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-medium capitalize text-gray-200">
                    {paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Razorpay"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-[#292929] pb-5">
                <div>
                  <h2 className="text-lg font-semibold">
                    Ordered items
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Products included in this order.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div
                      key={item.id || item._id}
                      className="flex gap-4 rounded-xl border border-[#292929] bg-[#0B0B0B] p-4"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#151515] sm:h-24 sm:w-24">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-semibold text-white">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-3 text-sm font-semibold text-[#C9A227]">
                          ₹
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 0)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-6 text-sm text-gray-500">
                    Order items are available in your order details.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-7">
              <h2 className="text-lg font-semibold">
                Customer information
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                    Name
                  </p>

                  <p className="mt-2 text-sm text-gray-300">
                    {customer.fullName ||
                      order?.user?.name ||
                      "Customer"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                    Email
                  </p>

                  <p className="mt-2 break-all text-sm text-gray-300">
                    {customer.email ||
                      order?.user?.email ||
                      "Not provided"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6 lg:sticky lg:top-24">
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#C9A227]">
              Complete
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Order confirmed
            </h2>

            <div className="mt-6 space-y-4 border-b border-[#292929] pb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Payment
                </span>

                <span className="font-medium text-green-400">
                  Paid
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Order status
                </span>

                <span className="font-medium text-[#C9A227]">
                  {orderStatus}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 text-sm">
                <span className="text-gray-500">
                  Payment ID
                </span>

                <span className="max-w-[200px] break-all text-right text-xs text-gray-400">
                  {paymentId || "—"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="font-medium">
                Total
              </span>

              <span className="text-2xl font-semibold text-[#C9A227]">
                ₹{total.toFixed(2)}
              </span>
            </div>

            {/* View Order Details */}
            <button
              type="button"
              onClick={handleViewOrderDetails}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-4 text-sm font-medium text-black transition hover:bg-[#E2C45A]"
            >
              View Order Details
              <FiArrowRight size={17} />
            </button>

            {/* View My Orders */}
            <button
              type="button"
              onClick={handleViewOrders}
              className="mt-3 flex w-full items-center justify-center rounded-xl border border-[#292929] px-5 py-4 text-sm font-medium text-gray-300 transition hover:border-[#C9A227] hover:text-[#C9A227]"
            >
              View My Orders
            </button>

            {/* Continue Shopping */}
            <Link
              to="/shop"
              className="mt-5 flex w-full items-center justify-center text-sm text-gray-500 transition hover:text-[#C9A227]"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default OrderSuccess;
