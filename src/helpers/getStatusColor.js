const statusColor = (data) =>
  (data.join() === "active" && "green") ||
  (data.join() === "pending" && "orange") ||
  (data.join() && "crimson");

export default statusColor;
