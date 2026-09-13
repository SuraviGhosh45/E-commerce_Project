import { FiArrowRight, FiPackage } from "react-icons/fi";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import StatCard from "../../components/admin/StatCard";
import OrderStatusBadge from "../../components/admin/OrderStatusBadge";

const Dashboard = () => {
  // ==========================================
  // FRONTEND-ONLY DEMO DATA
  // ==========================================

  const salesByCategory = [
    { name: "Electronics", value: 42 },
    { name: "Fashion", value: 25 },
    { name: "Accessories", value: 18 },
    { name: "Home & Living", value: 15 },
  ];

  const orderStatusData = [
    { name: "Delivered", value: 52 },
    { name: "Processing", value: 18 },
    { name: "Shipped", value: 20 },
    { name: "Cancelled", value: 10 },
  ];

  const recentOrders = [
    {
      id: "VD-2026-00124",
      customer: "Suravi Ghosh",
      amount: 307,
      status: "Delivered",
      date: "Sep 14, 2026",
    },
    {
      id: "VD-2026-00118",
      customer: "Rahul Sharma",
      amount: 249,
      status: "Shipped",
      date: "Sep 10, 2026",
    },
    {
      id: "VD-2026-00107",
      customer: "Ananya Das",
      amount: 129,
      status: "Processing",
      date: "Sep 05, 2026",
    },
    {
      id: "VD-2026-00096",
      customer: "Arjun Roy",
      amount: 438,
      status: "Delivered",
      date: "Aug 29, 2026",
    },
  ];

  const lowStockProducts = [
    {
      name: "Designer Chair",
      stock: 8,
      category: "Home & Living",
    },
    {
      name: "Classic Jacket",
      stock: 11,
      category: "Fashion",
    },
    {
      name: "Minimal Watch",
      stock: 12,
      category: "Accessories",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0B0B0B] px-4 py-6 text-[#F5F5F5] sm:px-6 lg:px-8">

      {/* =========================================
          HEADER
      ========================================== */}
      <div className="mb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-xs">
          Overview
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Here's what's happening with your store today.
            </p>
          </div>

          <p className="text-xs text-gray-600">
            Updated just now
          </p>

        </div>
      </div>

      {/* =========================================
          STAT CARDS
      ========================================== */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Sales"
          value="$24,850"
          change="+12.4%"
          changeType="positive"
          icon="sales"
          description="This month"
        />

        <StatCard
          title="Total Orders"
          value="1,284"
          change="+8.2%"
          changeType="positive"
          icon="orders"
          description="This month"
        />

        <StatCard
          title="Total Products"
          value="342"
          change="-2.1%"
          changeType="negative"
          icon="products"
          description="Currently listed"
        />

        <StatCard
          title="Total Users"
          value="8,421"
          change="+15.7%"
          changeType="positive"
          icon="users"
          description="Registered users"
        />

      </section>

      {/* =========================================
          CHARTS
      ========================================== */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* Sales by Category */}
        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">

          <div className="mb-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227]">
              Sales Distribution
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Sales by Category
            </h2>

            <p className="mt-1 text-xs text-gray-600">
              Percentage of total sales
            </p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                  fill="#C9A227"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#151515",
                    border: "1px solid #292929",
                    borderRadius: "12px",
                  }}
                  labelStyle={{
                    color: "#C9A227",
                  }}
                  itemStyle={{
                    color: "#F5F5F5",
                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "#A3A3A3",
                  }}
                />

              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status */}
        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">

          <div className="mb-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227]">
              Order Overview
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Orders by Status
            </h2>

            <p className="mt-1 text-xs text-gray-600">
              Current order distribution
            </p>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                  fill="#C9A227"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#151515",
                    border: "1px solid #292929",
                    borderRadius: "12px",
                  }}
                  labelStyle={{
                    color: "#C9A227",
                  }}
                  itemStyle={{
                    color: "#F5F5F5",
                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    color: "#A3A3A3",
                  }}
                />

              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* =========================================
          LOWER SECTION
      ========================================== */}
      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">

        {/* Recent Orders */}
        <div className="overflow-hidden rounded-2xl border border-[#292929] bg-[#151515]">

          <div className="flex items-center justify-between border-b border-[#292929] p-5 sm:p-6">

            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227]">
                Orders
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Recent Orders
              </h2>
            </div>

            <a
              href="/admin/orders"
              className="flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-[#C9A227]"
            >
              View all
              <FiArrowRight size={14} />
            </a>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[700px]">

              <thead>
                <tr className="border-b border-[#292929] bg-[#111111]">

                  <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.15em] text-gray-600">
                    Order
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.15em] text-gray-600">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.15em] text-gray-600">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.15em] text-gray-600">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-[10px] uppercase tracking-[0.15em] text-gray-600">
                    Date
                  </th>

                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#292929] last:border-b-0 transition hover:bg-[#111111]"
                  >

                    <td className="px-5 py-4 text-sm font-medium text-white">
                      #{order.id}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-300">
                      {order.customer}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#C9A227]">
                      ${order.amount.toFixed(2)}
                    </td>

                    <td className="px-5 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {order.date}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-2xl border border-[#292929] bg-[#151515]">

          <div className="border-b border-[#292929] p-5 sm:p-6">

            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227]">
              Inventory
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Low Stock Products
            </h2>

          </div>

          <div className="p-5 sm:p-6">

            <div className="space-y-4">

              {lowStockProducts.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between gap-4 rounded-xl border border-[#292929] bg-[#0B0B0B] p-4"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#151515] text-[#C9A227]">
                      <FiPackage size={17} />
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-medium text-gray-200">
                        {product.name}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-600">
                        {product.category}
                      </p>

                    </div>

                  </div>

                  <div className="shrink-0 text-right">

                    <p className="text-sm font-semibold text-red-400">
                      {product.stock}
                    </p>

                    <p className="text-[10px] text-gray-600">
                      left
                    </p>

                  </div>

                </div>
              ))}

            </div>

            <a
              href="/admin/products"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#292929] px-4 py-3 text-sm text-gray-400 transition hover:border-[#C9A227] hover:text-[#C9A227]"
            >
              Manage Inventory
              <FiArrowRight size={15} />
            </a>

          </div>
        </div>

      </section>

    </main>
  );
};

export default Dashboard;
