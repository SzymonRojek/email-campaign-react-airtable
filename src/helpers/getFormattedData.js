import moment from "moment";

const getFormattedData = (date) => {
  const slicedString = date.slice(0, 10);
  return moment(slicedString).format("YYYY/MM/DD");
};

export default getFormattedData;
