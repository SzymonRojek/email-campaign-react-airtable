const getFilteredDataByStatus = (data, status) => {
  if (!data) return;

  return data.filter((item) => item.fields.status === status);
};

export default getFilteredDataByStatus;
