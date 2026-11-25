const statusStyles = {
  pending: "bg-yellow-500/10 text-yellow-400",
  running: "bg-blue-500/10 text-blue-400",
  success: "bg-green-500/10 text-green-400",
  failed: "bg-red-500/10 text-red-400",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-500/10 text-gray-400"
      }`}
    >
      {status || "unknown"}
    </span>
  );
};

export default StatusBadge;
