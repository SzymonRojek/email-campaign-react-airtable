const statusColor = (data?: string): string | undefined =>
  ((data === "active" || data === "sent") && "green") ||
  ((data === "pending" || data === "draft") && "orange") ||
  (data ? "crimson" : undefined);

export default statusColor;
