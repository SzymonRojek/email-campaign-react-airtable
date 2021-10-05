const capitalizeFirstLetter = (string) => {
  const firstLetter = string.charAt(0);

  if (firstLetter === firstLetter.toUpperCase()) return string;

  return firstLetter.toUpperCase() + string.slice(1);
};

export default capitalizeFirstLetter;
