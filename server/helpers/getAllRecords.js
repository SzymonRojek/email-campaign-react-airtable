const { axiosInstance } = require("../controllers/axiosInstance");

// Airtable returns max 100 records per request - follow the offset to get all of them
exports.getAllRecords = async (endpoint) => {
  const records = [];
  let offset;

  do {
    const { data } = await axiosInstance.get(endpoint, { params: { offset } });

    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
};
