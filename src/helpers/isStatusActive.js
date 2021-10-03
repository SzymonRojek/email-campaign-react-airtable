const isStatusActive = (status, callback) =>
  status === "pending" || status === "blocked" ? true : callback();

export default isStatusActive;
