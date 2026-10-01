exports.capitalizeFirstLetter = (string) => {
  if (!string) return;

  const firstLetter = string.charAt(0).toUpperCase();
  const restString = string.slice(1);

  return `${firstLetter}${restString}`;
};
