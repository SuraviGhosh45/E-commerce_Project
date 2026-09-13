
import {
  FiArrowDown,
  FiArrowUp,
  FiDollarSign,
  FiPackage,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";

const iconMap = {
  sales: FiDollarSign,
  orders: FiShoppingBag,
  products: FiPackage,
  users: FiUsers,
};

const StatCard = ({
  title,
  value,
  change,
  changeType = "positive",
  icon = "sales",
  description,
}) => {
  const Icon = iconMap[icon] || FiDollarSign;

  const isPositive = changeType === "positive";

  return (
    <div className="rounded-2xl border border-[#292929] bg-[#151515] p-5 transition duration-300 hover:border-[#C9A227]/50 sm:p-6">

      {/* Top */}
      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-gray-500">
            {title}
          </p>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {value}
          </p>

          {description && (
            <p className="mt-2 text-xs text-gray-600">
              {description}
            </p>
          )}
        </div>

        {/* Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B0B0B] text-[#C9A227]">
          <Icon size={20} />
        </div>
      </div>

      {/* Bottom */}
      {change && (
        <div className="mt-5 flex items-center gap-2">

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              isPositive
                ? "bg-green-950/30 text-green-400"
                : "bg-red-950/30 text-red-400"
            }`}
          >
            {isPositive ? (
              <FiArrowUp size={12} />
            ) : (
              <FiArrowDown size={12} />
            )}

            {change}
          </span>

          <span className="text-[11px] text-gray-600">
            vs last period
          </span>

        </div>
      )}

    </div>
  );
};

export default StatCard;
