import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiChevronDown,
} from "react-icons/fi";

import DataTable from "../../components/admin/DataTable";
import OrderStatusBadge from "../../components/admin/OrderStatusBadge";

const OrderAdmin = () => {
  // Frontend-only demo data
  const [orders, setOrders] = useState([
    {
      id: "VD-2026-00124",
      customer: "Suravi Ghosh",
      email: "suravi@example.com",
      items: 3,
      amount: 307,
      payment: "Razorpay",
      status: "Delivered",
      date: "Sep 14, 2026",
    },
    {
      id: "VD-2026-00118",
      customer: "Rahul Sharma",
      email: "rahul@example.com",
      items: 2,
      amount: 249,
      payment: "Razorpay",
      status: "Shipped",
      date: "Sep 10, 2026",
    },
    {
      id: "VD-2026-00107",
      customer: "Ananya Das",
      email: "ananya@example.com",
      items: 1,
      amount: 129,
      payment: "COD",
      status: "Processing",
      date: "Sep 05, 2026",
    },
    {
      id: "VD-2026-00096",
      customer: "Arjun Roy",
      email: "arjun@example.com",
      items: 4,
      amount: 438,
      payment: "Razorpay",
      status: "Delivered",
      date: "Aug 29, 2026",
    },
    {
      id: "VD-2026-00082",
      customer: "Priya Sen",
      email: "priya@example.com",
      items: 2,
      amount: 199,
      payment: "COD",
      status: "Cancelled",
      date: "Aug 20, 2026",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const statuses = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
            }
          : order
      )
    );
  };

  const columns = [
    {
      key: "id",
      label: "Order ID",
      render: (order) => (
        <span className="font-medium text-white">
          #{order.id}
        </span>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      render: (order) => (
        <div>
          <p className="font-medium text-gray-200">
            {order.customer}
          </p>

          <p className="mt-1 text-xs text-gray-600">
            {order.email}
          </p>
        </div>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (order) => (
        <span className="text-gray-400">
          {order.items}{" "}
          {order.items === 1 ? "item" : "items"}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (order) => (
        <span className="font-semibold text-[#C9A227]">
          ${order.amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "payment",
      label: "Payment",
      render: (order) => (
        <span className="text-gray-400">
          {order.payment}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (order) => (
        <OrderStatusBadge status={order.status} />
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (order) => (
        <span className="text-gray-500">
          {order.date}
        </span>
      ),
    },
  ];

  const totalOrders = orders.length;

  const processingOrders = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "Shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  return (
    <main className="min-h-screen bg-[#0B0B0B] px-4 py-6 text-[#F5F5F5] sm:px-6 lg:px-8">

      {/* ================= HEADER ================= */}
      <div className="mb-8">

        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-xs">
          Administration
        </p>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Order Management
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Monitor orders, payments and delivery status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
            className="flex w-fit items-center gap-2 rounded-xl border border-[#292929] px-4 py-3 text-sm text-gray-400 transition hover:border-[#C9A227] hover:text-[#C9A227]"
          >
            <FiRefreshCw size={15} />
            Reset filters
          </button>

        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Total Orders
          </p>

          <p className="mt-3 text-2xl font-semibold text-white">
            {totalOrders}
          </p>
        </div>

        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Processing
          </p>

          <p className="mt-3 text-2xl font-semibold text-[#C9A227]">
            {processingOrders}
          </p>
        </div>

        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Shipped
          </p>

          <p className="mt-3 text-2xl font-semibold text-blue-400">
            {shippedOrders}
          </p>
        </div>

        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5">
          <p className="text-xs uppercase tracking-wider text-gray-600">
            Delivered
          </p>

          <p className="mt-3 text-2xl font-semibold text-green-400">
            {deliveredOrders}
          </p>
        </div>

      </section>

      {/* ================= FILTERS ================= */}
      <section className="mt-6 rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <FiSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID or customer..."
              className="w-full rounded-xl border border-[#292929] bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-[#C9A227]"
            />
          </div>

          {/* Status */}
          <div className="relative min-w-[190px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#292929] bg-[#0B0B0B] px-4 py-3.5 text-sm text-gray-300 outline-none transition focus:border-[#C9A227]"
            >
              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status === "All"
                    ? "All statuses"
                    : status}
                </option>
              ))}
            </select>

            <FiChevronDown
              size={16}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
            />
          </div>

        </div>
      </section>

      {/* ================= TABLE ================= */}
      <section className="mt-6">

        <DataTable
          columns={columns}
          data={filteredOrders}
          emptyMessage="No orders match your filters."
          actions={(order) => (
            <>
              <Link
                to={`/orders/${order.id}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#292929] text-gray-400 transition hover:border-[#C9A227] hover:bg-[#C9A227] hover:text-black"
                title="View order"
              >
                <FiEye size={16} />
              </Link>

              {/* Quick status change */}
              <select
                value={order.status}
                onChange={(e) =>
                  updateOrderStatus(
                    order.id,
                    e.target.value
                  )
                }
                className="rounded-lg border border-[#292929] bg-[#0B0B0B] px-2 py-2 text-xs text-gray-400 outline-none transition focus:border-[#C9A227]"
                title="Update status"
              >
                {statuses
                  .filter((status) => status !== "All")
                  .map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
              </select>
            </>
          )}
        />

      </section>

    </main>
  );
};

export default OrderAdmin;