import moment from "moment";

const getFormattedDate = (date?: string) => moment(date).format("YYYY/MM/DD");

const getFormattedTime = (time?: string) => moment(time).format("h:mm a");

const formattedData = { getFormattedDate, getFormattedTime };

export default formattedData;
