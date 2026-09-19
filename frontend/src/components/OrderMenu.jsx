import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronDown, FiPackage } from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const OrderMenu = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Close My Orders dropdown whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated || isAdmin) {
      setOrders([]);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await api.get("/orders/myorders");

        const backendOrders = Array.isArray(
          response.data?.orders
        )
          ? response.data.orders
          : [];

        setOrders(backendOrders.slice(0, 3));
      } catch (error) {
        console.error(
          "NAVBAR ORDERS ERROR:",
          error
        );

        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, isAdmin]);

  if (!isAuthenticated || isAdmin) {
    return null;
  }

  const getStatusClasses = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-950/30 text-green-400 border-green-900/40";

      case "Shipped":
        return "bg-blue-950/30 text-blue-400 border-blue-900/40";

      case "Processing":
        return "bg-[#C9A227]/10 text-[#E2C45A] border-[#C9A227]/30";

      case "Pending":
        return "bg-yellow-950/20 text-yellow-400 border-yellow-900/40";

      case "Cancelled":
        return "bg-red-950/30 text-red-400 border-red-900/40";

      case "Returned":
        return "bg-orange-950/30 text-orange-400 border-orange-900/40";

      default:
        return "bg-[#111111] text-gray-400 border-[#292929]";
    }
  };

  return (
    <div className="relative">
      {/* NAVBAR BUTTON */}
      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        className="flex items-center gap-1.5 text-sm font-medium text-gray-300 transition hover:text-[#C9A227]"
      >
        My Orders

        <FiChevronDown
          size={15}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 top-full z-50 mt-4 w-[340px] overflow-hidden rounded-2xl border border-[#292929] bg-[#151515] shadow-2xl">

          {/* HEADER */}
          <div className="border-b border-[#292929] px-5 py-4">
            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B0B0B] text-[#C9A227]">
                <FiPackage size={17} />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  My Orders
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  Track your recent purchases
                </p>
              </div>

            </div>
          </div>

          {/* CONTENT */}
          <div className="max-h-[320px] overflow-y-auto">

            {loading ? (
              <div className="px-5 py-8 text-center">
                <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#292929] border-t-[#C9A227]" />

                <p className="mt-3 text-xs text-gray-500">
                  Loading orders...
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div className="px-5 py-8 text-center">

                <p className="text-sm text-gray-400">
                  No orders yet
                </p>

                <Link
                  to="/shop"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-block text-xs font-medium text-[#C9A227] hover:text-[#E2C45A]"
                >
                  Start Shopping
                </Link>

              </div>
            ) : (
              <div className="divide-y divide-[#292929]">

                {orders.map((order) => (
                  <Link
                    key={order._id}
                    to={`/orders/${order._id}`}
                    onClick={() => setOpen(false)}
                    className="block px-5 py-4 transition hover:bg-[#0B0B0B]"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-gray-400">
                          #{order._id}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          ₹
                          {Number(
                            order.totalAmount || 0
                          ).toFixed(2)}
                        </p>

                        <p className="mt-1 text-[11px] text-gray-600">
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "—"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>

                    </div>

                  </Link>
                ))}

              </div>
            )}

          </div>

          {/* FOOTER */}
          <div className="border-t border-[#292929] p-3">

            <Link
              to="/orders"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-[#C9A227] px-4 py-3 text-xs font-semibold text-black transition hover:bg-[#E2C45A]"
            >
              View All Orders
            </Link>

          </div>

        </div>
      )}
    </div>
  );
};

export default OrderMenu;