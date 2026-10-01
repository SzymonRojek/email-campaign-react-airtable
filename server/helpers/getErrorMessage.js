// returns only safe error details - never the axios config (it holds the Airtable token)
exports.getErrorMessage = (error) =>
  error.response?.data?.error?.message ||
  error.response?.data?.error ||
  error.message;
