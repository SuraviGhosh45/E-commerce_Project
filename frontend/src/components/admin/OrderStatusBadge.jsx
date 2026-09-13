
const OrderStatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase();

  const statusStyles = {
    pending: "border-yellow-900/40 bg-yellow-950/30 text-yellow-400",
    processing: "border-[#C9A227]/30 bg-[#C9A227]/10 text-[#E2C45A]",
    shipped: "border-blue-900/40 bg-blue-950/30 text-blue-400",
    delivered: "border-green-900/40 bg-green-950/30 text-green-400",
    cancelled: "border-red-900/40 bg-red-950/30 text-red-400",
    failed: "border-red-900/40 bg-red-950/30 text-red-400",
  };

  const style =
    statusStyles[normalizedStatus] ||
    "border-[#292929] bg-[#111111] text-gray-400";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      <span className="capitalize">
        {status || "Unknown"}
      </span>
    </span>
  );
};

export default OrderStatusBadge;

