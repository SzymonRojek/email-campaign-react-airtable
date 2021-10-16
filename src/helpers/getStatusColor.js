const statusColor = (data) =>
  ((data === "active" || data === "sent") && "green") ||
  ((data === "pending" || data === "draft") && "orange") ||
  (data && "crimson");

export default statusColor;
