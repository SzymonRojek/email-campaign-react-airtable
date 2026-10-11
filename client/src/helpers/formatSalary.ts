// "18000" -> "18,000 / month"; the field is free text, so anything else stays as typed
const formatSalary = (expectedSalary?: string) => {
  const value = expectedSalary?.trim();
  if (!value) return "";

  return /^\d+$/.test(value)
    ? `${Number(value).toLocaleString("en-US")} / month`
    : value;
};

export default formatSalary;
