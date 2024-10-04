export const formatDateTime = (timestamp) => {
  if (!timestamp || isNaN(new Date(timestamp).getTime())) {
    return "Unknown date";
  }
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export const formatChange = (change) => {
  if (!change || change === "0.00") return null;
  const isIncrease = parseFloat(change) > 0;
  return (
    <span style={{ color: isIncrease ? "green" : "red" }}>
      {isIncrease ? `+${change}%` : `${change}%`}
    </span>
  );
};
