const statusColor = (data) =>
  (data === "active" && "green") ||
  (data === "pending" && "orange") ||
  (data && "crimson");

export default statusColor;
