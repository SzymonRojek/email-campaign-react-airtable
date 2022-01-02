const getFilteredDataByStatus = (data, status) =>
  data.filter((item) => item.fields.status === status);

export default getFilteredDataByStatus;
