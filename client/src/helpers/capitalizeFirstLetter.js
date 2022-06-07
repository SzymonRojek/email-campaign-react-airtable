const capitalizeFirstLetter = (string) => {
  if (!string) return;

  const firstLetter = string.charAt(0).toUpperCase();
  const restString = string.slice(1).toLowerCase();

  return `${firstLetter}${restString}`;
};

export default capitalizeFirstLetter;
