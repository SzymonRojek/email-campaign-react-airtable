import moment from "moment";

const getFormattedDate = (date) => moment(date).format("YYYY/MM/DD");

const getFormattedTime = (time) => moment(time).format("h:mm a");

const formattedData = { getFormattedDate, getFormattedTime };

export default formattedData;
