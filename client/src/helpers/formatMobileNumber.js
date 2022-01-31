const formatMobileNumber = (mobileNumber) => {
  const mobileString = String(mobileNumber).replace(/\D/g, "");
  const match = mobileString.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return "";
};

export default formatMobileNumber;
