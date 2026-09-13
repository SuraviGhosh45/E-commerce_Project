import {
  FiArrowDown,
  FiArrowUp,
  FiBarChart2,
  FiDollarSign,
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
} from "recharts";

const Analytics = () => {
  // ==========================================
  // FRONTEND-ONLY DEMO DATA
  // ==========================================

  const revenueData = [
    { month: "Jan", revenue: 4200, orders: 42 },
    { month: "Feb", revenue: 5800, orders: 57 },
    { month: "Mar", revenue: 6200, orders: 65 },
    { month: "Apr", revenue: 7100, orders: 74 },
    { month: "May", revenue: 8600, orders: 89 },
    { month: "Jun", revenue: 9200, orders: 96 },
    { month: "Jul", revenue: 10400, orders: 108 },
    { month: "Aug", revenue: 11800, orders: 121 },
    { month: "Sep", revenue: 13200, orders: 138 },
  ];

  const salesByCategory = [
    {
      name: "Electronics",
      value: 42,
      fill: "#C9A227",
    },
    {
      name: "Fashion",
      value: 25,
      fill: "#8F741D",
    },
    {
      name: "Accessories",
      value: 18,
      fill: "#E2C45A",
    },
    {
      name: "Home & Living",
      value: 15,
      fill: "#5F4E18",
    },
  ];

  const orderStatusData = [
    {
      name: "Delivered",
      value: 52,
      fill: "#22C55E",
    },
    {
      name: "Processing",
      value: 18,
      fill: "#C9A227",
    },
    {
      name: "Shipped",
      value: 20,
      fill: "#3B82F6",
    },
    {
      name: "Cancelled",
      value: 10,
      fill: "#EF4444",
    },
  ];

  const topProducts = [
    {
      name: "Premium Headphones",
      category: "Electronics",
      sales: 284,
      revenue: 36636,
    },
    {
      name: "Modern Sneakers",
      category: "Fashion",
      sales: 241,
      revenue: 26510,
    },
    {
      name: "Minimal Watch",
      category: "Accessories",
      sales: 198,
      revenue: 17622,
    },
    {
      name: "Wireless Speaker",
      category: "Electronics",
      sales: 176,
      revenue: 17424,
    },
    {
      name: "Leather Backpack",
      category: "Accessories",
      sales: 145,
      revenue: 21605,
    },
  ];

  // ==========================================
  // KPI VALUES
  // ==========================================

  const totalRevenue = revenueData.reduce(
    (total, item) => total + item.revenue,
    0
  );

  const totalOrders = revenueData.reduce(
    (total, item) => total + item.orders,
    0
  );

  const averageOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <main className="min-h-screen bg-[#0B0B0B] px-4 py-6 text-[#F5F5F5] sm:px-6 lg:px-8">

      {/* =========================================
          HEADER
      ========================================== */}
      <div className="mb-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C9A227] sm:text-xs">
          Administration
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Analytics
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Monitor revenue, order performance, product trends and customer
              activity.
            </p>
          </div>

          <span className="text-xs text-gray-600">
            Frontend demo data
          </span>

        </div>
      </div>

      {/* =========================================
          KPI CARDS
      ========================================== */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Revenue */}
        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Total Revenue
              </p>

              <p className="mt-3 text-2xl font-semibold sm:text-3xl">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B0B0B] text-[#C9A227]">
              <FiDollarSign size={20} />
            </div>

          </div>

          <div className="mt-5 flex items-center gap-2">

            <span className="inline-flex items-center gap-1 rounded-full bg-green-950/30 px-2.5 py-1 text-[11px] font-medium text-green-400">
              <FiArrowUp size={12} />
              14.8%
            </span>

            <span className="text-[11px] text-gray-600">
              vs previous period
            </span>

          </div>
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

          <div className="mt-5 flex items-center gap-2">

            <span className="inline-flex items-center gap-1 rounded-full bg-green-950/30 px-2.5 py-1 text-[11px] font-medium text-green-400">
              <FiArrowUp size={12} />
              9.6%
            </span>

            <span className="text-[11px] text-gray-600">
              vs previous period
            </span>

          </div>
        </div>

        {/* Average Order Value */}
        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Average Order
              </p>

              <p className="mt-3 text-2xl font-semibold sm:text-3xl">
                ${averageOrderValue.toFixed(0)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B0B0B] text-[#C9A227]">
              <FiBarChart2 size={20} />
            </div>

          </div>

          <div className="mt-5 flex items-center gap-2">

            <span className="inline-flex items-center gap-1 rounded-full bg-green-950/30 px-2.5 py-1 text-[11px] font-medium text-green-400">
              <FiArrowUp size={12} />
              6.2%
            </span>

            <span className="text-[11px] text-gray-600">
              vs previous period
            </span>

          </div>
        </div>

        {/* Growth */}
        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-600">
                Growth Rate
              </p>

              <p className="mt-3 text-2xl font-semibold sm:text-3xl">
                18.4%
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B0B0B] text-[#C9A227]">
              <FiTrendingUp size={20} />
            </div>

          </div>

          <div className="mt-5 flex items-center gap-2">

            <span className="inline-flex items-center gap-1 rounded-full bg-red-950/30 px-2.5 py-1 text-[11px] font-medium text-red-400">
              <FiArrowDown size={12} />
              1.8%
            </span>

            <span className="text-[11px] text-gray-600">
              vs previous period
            </span>

          </div>
        </div>

      </section>

      {/* =========================================
          REVENUE TREND
      ========================================== */}
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
              Revenue generated over the selected period.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#C9A227]">
            <span className="h-2 w-2 rounded-full bg-[#C9A227]" />
            Revenue
          </div>

        </div>

        <div className="h-[320px] w-full sm:h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
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

      {/* =========================================
          PIE CHARTS
      ========================================== */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* Sales by category */}
        <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">

          <div className="mb-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227]">
              Category Analysis
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Sales by category
            </h2>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
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
                />

                <Tooltip
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
                    color: "#A3A3A3",
                  }}
                />

              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order status */}
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
            <ResponsiveContainer width="100%" height="100%">
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
                />

                <Tooltip
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
                    color: "#A3A3A3",
                  }}
                />

              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* =========================================
          TOP PRODUCTS
      ========================================== */}
      <section className="mt-6 rounded-2xl border border-[#292929] bg-[#151515] p-5 sm:p-6">

        <div className="mb-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A227]">
            Product Performance
          </p>

          <h2 className="mt-2 text-lg font-semibold sm:text-xl">
            Top selling products
          </h2>

          <p className="mt-1 text-xs text-gray-600">
            Products generating the most sales and revenue.
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

              {topProducts.map((product, index) => (
                <tr
                  key={product.name}
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
                    ${product.revenue.toLocaleString()}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>
      </section>

      {/* =========================================
          MONTHLY ORDERS
      ========================================== */}
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
          <ResponsiveContainer width="100%" height="100%">
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
                tick={{
                  fill: "#666666",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
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