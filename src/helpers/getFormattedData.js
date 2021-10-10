import moment from "moment";

const getFormattedData = (date) => moment(date).format("YYYY/MM/DD");

export default getFormattedData;
