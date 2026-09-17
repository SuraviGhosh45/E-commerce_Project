import { useEffect, useMemo, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiBarChart2,
  FiDollarSign,
  FiRefreshCw,
  FiShoppingBag,
  FiTrendingUp,
} from "react-icons/fi";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

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

const Analytics = () => {
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
  // FETCH ANALYTICS DATA
  // ==================================================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsResponse, ordersResponse, productsResponse] =
        await Promise.all([
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

      setOrders(ordersResponse.data?.orders || []);
      setProducts(productsResponse.data?.products || []);
    } catch (error) {
      console.error("FETCH ANALYTICS ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load analytics data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ==================================================
  // PRODUCT CATEGORY MAP
  // ==================================================

  const productCategoryMap = useMemo(() => {
    const map = {};

    products.forEach((product) => {
      const id = product._id || product.id;

      if (id) {
        map[String(id)] = product.category || "Uncategorized";
      }
    });

    return map;
  }, [products]);

  // ==================================================
  // MONTHLY REVENUE + ORDERS
  // ==================================================

  const revenueData = useMemo(() => {
    const now = new Date();

    const months = [];

    for (let i = 11; i >= 0; i -= 1) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      months.push({
        key,
        month: date.toLocaleString("en-US", {
          month: "short",
        }),
        revenue: 0,
        orders: 0,
      });
    }

    const monthMap = Object.fromEntries(
      months.map((month) => [month.key, month])
    );

    orders.forEach((order) => {
      if (!order.createdAt) {
        return;
      }

      const date = new Date(order.createdAt);

      if (Number.isNaN(date.getTime())) {
        return;
      }

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthMap[key]) {
        return;
      }

      monthMap[key].orders += 1;

      monthMap[key].revenue +=
        Number(order.totalAmount) || 0;
    });

    return months;
  }, [orders]);

  // ==================================================
  // SALES BY CATEGORY
  // ==================================================

  const salesByCategory = useMemo(() => {
    const categoryMap = {};

    orders.forEach((order) => {
      const items = order.items || [];

      items.forEach((item) => {
        const product = item.productId;

        const productId =
          typeof product === "object"
            ? product?._id
            : product;

        const category =
          (typeof product === "object"
            ? product?.category
            : null) ||
          productCategoryMap[String(productId)] ||
          "Uncategorized";

        const quantity = Number(item.quantity) || 0;

        categoryMap[category] =
          (categoryMap[category] || 0) + quantity;
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
  // ORDER STATUS DATA
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
        fill: STATUS_COLORS[name] || "#666666",
      }))
      .sort((a, b) => b.value - a.value);
  }, [orders]);

  // ==================================================
  // TOP PRODUCTS
  // ==================================================

  const topProducts = useMemo(() => {
    const productMap = {};

    orders.forEach((order) => {
      const items = order.items || [];

      items.forEach((item) => {
        const product =
          typeof item.productId === "object"
            ? item.productId
            : null;

        const productId =
          product?._id ||
          item.productId;

        if (!productId) {
          return;
        }

        const key = String(productId);

        const quantity =
          Number(item.quantity) || 0;

        const price =
          Number(item.price) ||
          Number(product?.price) ||
          0;

        if (!productMap[key]) {
          productMap[key] = {
            name: product?.name || "Unknown Product",
            category:
              product?.category ||
              productCategoryMap[key] ||
              "Uncategorized",
            sales: 0,
            revenue: 0,
          };
        }

        productMap[key].sales += quantity;

        productMap[key].revenue +=
          quantity * price;
      });
    });

    return Object.values(productMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [orders, productCategoryMap]);

  // ==================================================
  // CALCULATED VALUES
  // ==================================================

  const totalRevenue =
    Number(stats.total_Revenue) || 0;

  const totalOrders =
    Number(stats.total_order) || 0;

  const averageOrderValue =
    totalOrders > 0
      ? totalRevenue / totalOrders
      : 0;

  // ==================================================
  // MONTHLY GROWTH
  // ==================================================

  const monthlyGrowth = useMemo(() => {
    if (revenueData.length < 2) {
      return 0;
    }

    const currentMonth =
      revenueData[revenueData.length - 1]?.revenue || 0;

    const previousMonth =
      revenueData[revenueData.length - 2]?.revenue || 0;

    if (previousMonth === 0) {
      return currentMonth > 0 ? 100 : 0;
    }

    return (
      ((currentMonth - previousMonth) /
        previousMonth) *
      100
    );
  }, [revenueData]);

  const growthIsPositive = monthlyGrowth >= 0;

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
              Loading analytics...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0B0B] px-4 py-6 text-[#F5F5F5] sm:px-6 lg:px-8">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-xs">
          Administration
        </p>

        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Analytics
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Monitor revenue, order performance,
              product trends and customer activity.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex w-fit items-center gap-2 rounded-xl border border-[#292929] px-4 py-3 text-sm text-gray-400 transition hover:border-[#C9A227] hover:text-[#C9A227] disabled:opacity-50"
          >
            <FiRefreshCw size={15} />
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
          KPI CARDS
      ================================================= */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Revenue */}
        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Total Revenue
              </p>

              <p className="mt-3 text-2xl font-semibold sm:text-3xl">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B0B0B] text-[#C9A227]">
              <FiDollarSign size={20} />
            </div>
          </div>

          <p className="mt-5 text-[11px] text-gray-600">
            From all stored orders
          </p>
        </div>

        {/* Orders */}
        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Total Orders
              </p>

              <p className="mt-3 text-2xl font-semibold sm:text-3xl">
                {totalOrders.toLocaleString()}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B0B0B] text-[#C9A227]">
              <FiShoppingBag size={20} />
            </div>
          </div>

          <p className="mt-5 text-[11px] text-gray-600">
            Orders stored in MongoDB
          </p>
        </div>

        {/* Average order */}
        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Average Order
              </p>

              <p className="mt-3 text-2xl font-semibold sm:text-3xl">
                ₹
                {averageOrderValue.toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 0,
                  }
                )}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B0B0B] text-[#C9A227]">
              <FiBarChart2 size={20} />
            </div>
          </div>

          <p className="mt-5 text-[11px] text-gray-600">
            Revenue ÷ total orders
          </p>
        </div>

        {/* Growth */}
        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Monthly Growth
              </p>

              <p className="mt-3 text-2xl font-semibold sm:text-3xl">
                {Math.abs(monthlyGrowth).toFixed(1)}%
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B0B0B] text-[#C9A227]">
              <FiTrendingUp size={20} />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                growthIsPositive
                  ? "bg-green-950/30 text-green-400"
                  : "bg-red-950/30 text-red-400"
              }`}
            >
              {growthIsPositive ? (
                <FiArrowUp size={12} />
              ) : (
                <FiArrowDown size={12} />
              )}

              {Math.abs(monthlyGrowth).toFixed(1)}%
            </span>

            <span className="text-[11px] text-gray-600">
              vs previous month
            </span>
          </div>
        </div>
      </section>

      {/* =================================================
          REVENUE TREND
      ================================================= */}

      <section className="mt-6 rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227]">
              Revenue Performance
            </p>

            <h2 className="mt-2 text-lg font-semibold sm:text-xl">
              Monthly revenue
            </h2>

            <p className="mt-1 text-xs text-gray-600">
              Revenue generated from stored orders.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#C9A227]">
            <span className="h-2 w-2 rounded-full bg-[#C9A227]" />
            Revenue
          </div>
        </div>

        <div className="h-[320px] w-full sm:h-[380px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={revenueData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                stroke="#292929"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{
                  fill: "#666666",
                  fontSize: 11,
                }}
                axisLine={{
                  stroke: "#292929",
                }}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: "#666666",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString(
                    "en-IN"
                  )}`,
                  "Revenue",
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

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#C9A227"
                strokeWidth={3}
                dot={{
                  fill: "#C9A227",
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* =================================================
          PIE CHARTS
      ================================================= */}

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Sales by Category */}
        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">
          <div className="mb-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227]">
              Category Analysis
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Units sold by category
            </h2>
          </div>

          <div className="h-[320px]">
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
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="48%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={3}
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
                      `${value} units`,
                      "Units Sold",
                    ]}
                    contentStyle={{
                      backgroundColor: "#151515",
                      border: "1px solid #292929",
                      borderRadius: "12px",
                    }}
                    itemStyle={{
                      color: "#F5F5F5",
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Order Status */}
        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">
          <div className="mb-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227]">
              Order Analysis
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Orders by status
            </h2>
          </div>

          <div className="h-[320px]">
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
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="48%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={3}
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
                    itemStyle={{
                      color: "#F5F5F5",
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          TOP PRODUCTS
      ================================================= */}

      <section className="mt-6 rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">
        <div className="mb-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227]">
            Product Performance
          </p>

          <h2 className="mt-2 text-lg font-semibold sm:text-xl">
            Top selling products
          </h2>

          <p className="mt-1 text-xs text-gray-600">
            Products generating the most sales and
            revenue.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#292929]">
                <th className="px-4 py-4 text-left text-[10px] uppercase tracking-[0.15em] text-gray-600">
                  Product
                </th>

                <th className="px-4 py-4 text-left text-[10px] uppercase tracking-[0.15em] text-gray-600">
                  Category
                </th>

                <th className="px-4 py-4 text-left text-[10px] uppercase tracking-[0.15em] text-gray-600">
                  Units Sold
                </th>

                <th className="px-4 py-4 text-left text-[10px] uppercase tracking-[0.15em] text-gray-600">
                  Revenue
                </th>
              </tr>
            </thead>

            <tbody>
              {topProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-10 text-center text-sm text-gray-600"
                  >
                    No product sales data available.
                  </td>
                </tr>
              ) : (
                topProducts.map((product, index) => (
                  <tr
                    key={`${product.name}-${index}`}
                    className="border-b border-[#292929] last:border-b-0 transition hover:bg-[#111111]"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B0B0B] text-xs font-semibold text-[#C9A227]">
                          {index + 1}
                        </div>

                        <span className="text-sm font-medium text-gray-200">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-500">
                      {product.category}
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-300">
                      {product.sales}
                    </td>

                    <td className="px-4 py-4 text-sm font-semibold text-[#C9A227]">
                      ₹
                      {product.revenue.toLocaleString(
                        "en-IN"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* =================================================
          MONTHLY ORDERS
      ================================================= */}

      <section className="mt-6 rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">
        <div className="mb-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227]">
            Order Performance
          </p>

          <h2 className="mt-2 text-lg font-semibold">
            Monthly order volume
          </h2>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={revenueData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                stroke="#292929"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{
                  fill: "#666666",
                  fontSize: 11,
                }}
                axisLine={{
                  stroke: "#292929",
                }}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#666666",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                formatter={(value) => [
                  value,
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

              <Legend />

              <Bar
                dataKey="orders"
                name="Orders"
                fill="#C9A227"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </main>
  );
};

export default Analytics;