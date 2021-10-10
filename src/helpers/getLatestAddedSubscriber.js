import moment from "moment";

const formattedDate = (date) => moment(date).format("YYYY-MM-DD HH:mm:ss");

const getLatestAddedSubscriber = (data) => {
  data = [...data];

  const sortedData = data.sort((a, b) => {
    const dateA = new Date(formattedDate(a.createdTime)).getTime();
    const dateB = new Date(formattedDate(b.createdTime)).getTime();

    return dateA > dateB ? 1 : -1;
  });

  return sortedData.slice(-1);
};

export default getLatestAddedSubscriber;
