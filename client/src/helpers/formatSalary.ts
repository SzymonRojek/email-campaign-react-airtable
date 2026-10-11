// "18000" -> "18,000 / month"; the field is free text, so anything else stays as typed
const formatSalary = (salary?: string) => {
  const value = salary?.trim();
  if (!value) return "";

  return /^\d+$/.test(value)
    ? `${Number(value).toLocaleString("en-US")} / month`
    : value;
};

export default formatSalary;
