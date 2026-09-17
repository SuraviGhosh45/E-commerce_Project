import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiPackage,
  FiRefreshCw,
} from "react-icons/fi";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import StatCard from "../../components/admin/StatCard";
import OrderStatusBadge from "../../components/admin/OrderStatusBadge";
import api from "../../services/api";

const CATEGORY_COLORS = [
  "#C9A227",
  "#8F741D",
  "#E2C45A",
  "#5F4E18",
  "#B08D20",
  "#6F5A1A",
];

const STATUS_COLORS = {
  Pending: "#A3A3A3",
  Processing: "#C9A227",
  Shipped: "#3B82F6",
  Delivered: "#22C55E",
  Cancelled: "#EF4444",
  Returned: "#A855F7",
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_user: 0,
    total_product: 0,
    total_order: 0,
    total_Revenue: 0,
  });

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // FETCH DASHBOARD DATA
  // ==================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        statsResponse,
        ordersResponse,
        productsResponse,
      ] = await Promise.all([
        api.get("/admin/analytics"),
        api.get("/orders"),
        api.get("/products"),
      ]);

      setStats({
        total_user:
          Number(statsResponse.data?.total_user) || 0,

        total_product:
          Number(statsResponse.data?.total_product) || 0,

        total_order:
          Number(statsResponse.data?.total_order) || 0,

        total_Revenue:
          Number(statsResponse.data?.total_Revenue) || 0,
      });

      setOrders(
        ordersResponse.data?.allOrders || []
      );

      setProducts(
        productsResponse.data?.products || []
      );
    } catch (error) {
      console.error(
        "FETCH ADMIN DASHBOARD ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==================================================
  // PRODUCT CATEGORY MAP
  // ==================================================

  const productCategoryMap = useMemo(() => {
    const map = {};

    products.forEach((product) => {
      const id = product?._id || product?.id;

      if (id) {
        map[String(id)] =
          product.category || "Uncategorized";
      }
    });

    return map;
  }, [products]);

  // ==================================================
  // SALES BY CATEGORY
  // ==================================================

  const salesByCategory = useMemo(() => {
    const categoryMap = {};

    orders.forEach((order) => {
      if (!Array.isArray(order.items)) {
        return;
      }

      order.items.forEach((item) => {
        const product =
          typeof item.productId === "object"
            ? item.productId
            : null;

        const productId =
          typeof product === "object"
            ? product?._id
            : item.productId;

        const category =
          product?.category ||
          productCategoryMap[String(productId)] ||
          "Uncategorized";

        const quantity =
          Number(item.quantity) || 0;

        const price =
          Number(item.price) ||
          Number(product?.price) ||
          0;

        if (!categoryMap[category]) {
          categoryMap[category] = 0;
        }

        categoryMap[category] +=
          price * quantity;
      });
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .map((item, index) => ({
        ...item,
        fill:
          CATEGORY_COLORS[
            index % CATEGORY_COLORS.length
          ],
      }));
  }, [orders, productCategoryMap]);

  // ==================================================
  // ORDER STATUS
  // ==================================================

  const orderStatusData = useMemo(() => {
    const statusMap = {};

    orders.forEach((order) => {
      const status = order.status || "Pending";

      statusMap[status] =
        (statusMap[status] || 0) + 1;
    });

    return Object.entries(statusMap)
      .map(([name, value]) => ({
        name,
        value,
        fill:
          STATUS_COLORS[name] || "#666666",
      }))
      .sort((a, b) => b.value - a.value);
  }, [orders]);

  // ==================================================
  // RECENT ORDERS
  // ==================================================

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        return (
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
        );
      })
      .slice(0, 5)
      .map((order) => ({
        id: order._id,

        customer:
          order.user?.name ||
          order.address?.fullname ||
          "Unknown Customer",

        amount:
          Number(order.totalAmount) || 0,

        status:
          order.status || "Pending",

        date: order.createdAt
          ? new Date(
              order.createdAt
            ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—",
      }));
  }, [orders]);

  // ==================================================
  // LOW STOCK PRODUCTS
  // ==================================================

  const lowStockProducts = useMemo(() => {
    return [...products]
      .filter(
        (product) =>
          Number(product.stock) <= 10
      )
      .sort(
        (a, b) =>
          Number(a.stock) -
          Number(b.stock)
      )
      .slice(0, 5)
      .map((product) => ({
        id: product._id,
        name:
          product.name || "Unnamed Product",
        stock: Number(product.stock) || 0,
        category:
          product.category ||
          "Uncategorized",
      }));
  }, [products]);

  // ==================================================
  // FORMAT CURRENCY
  // ==================================================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0B0B] px-4 py-10 text-[#F5F5F5] sm:px-6 lg:px-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <FiRefreshCw
              size={28}
              className="mx-auto animate-spin text-[#C9A227]"
            />

            <p className="mt-4 text-sm text-gray-500">
              Loading dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==================================================
  // DASHBOARD
  // ==================================================

  return (
    <main className="min-h-screen bg-[#0B0B0B] px-4 py-6 text-[#F5F5F5] sm:px-6 lg:px-8">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-xs">
          Overview
        </p>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Here's what's happening with your
              store today.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchDashboardData}
            className="flex w-fit items-center gap-2 rounded-xl border border-[#292929] px-4 py-3 text-xs text-gray-400 transition hover:border-[#C9A227] hover:text-[#C9A227]"
          >
            <FiRefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={formatCurrency(
            stats.total_Revenue
          )}
          change=""
          changeType="positive"
          icon="sales"
          description="All recorded orders"
        />

        <StatCard
          title="Total Orders"
          value={stats.total_order.toLocaleString()}
          change=""
          changeType="positive"
          icon="orders"
          description="All recorded orders"
        />

        <StatCard
          title="Total Products"
          value={stats.total_product.toLocaleString()}
          change=""
          changeType="positive"
          icon="products"
          description="Currently listed"
        />

        <StatCard
          title="Total Users"
          value={stats.total_user.toLocaleString()}
          change=""
          changeType="positive"
          icon="users"
          description="Registered customers"
        />
      </section>

      {/* =================================================
          CHARTS
      ================================================= */}

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
              Revenue distribution by product
              category
            </p>
          </div>

          <div className="h-[320px] w-full">
            {salesByCategory.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-600">
                No sales data available.
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {salesByCategory.map(
                      (entry, index) => (
                        <Cell
                          key={`category-${index}`}
                          fill={entry.fill}
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(value),
                      "Sales",
                    ]}
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
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
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
            {orderStatusData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-gray-600">
                No order data available.
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {orderStatusData.map(
                      (entry, index) => (
                        <Cell
                          key={`status-${index}`}
                          fill={entry.fill}
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    formatter={(value) => [
                      `${value} orders`,
                      "Orders",
                    ]}
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
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          LOWER SECTION
      ================================================= */}

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

            <Link
              to="/admin/orders"
              className="flex items-center gap-2 text-xs font-medium text-gray-500 transition hover:text-[#C9A227]"
            >
              View all
              <FiArrowRight size={14} />
            </Link>
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
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-10 text-center text-sm text-gray-600"
                    >
                      No orders available.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
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
                        ₹
                        {order.amount.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <OrderStatusBadge
                          status={order.status}
                        />
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500">
                        {order.date}
                      </td>
                    </tr>
                  ))
                )}
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
            {lowStockProducts.length === 0 ? (
              <div className="rounded-xl border border-[#292929] bg-[#0B0B0B] p-6 text-center text-sm text-gray-600">
                No low-stock products.
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
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
            )}

            <Link
              to="/admin/products"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#292929] px-4 py-3 text-sm text-gray-400 transition hover:border-[#C9A227] hover:text-[#C9A227]"
            >
              Manage Inventory
              <FiArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;