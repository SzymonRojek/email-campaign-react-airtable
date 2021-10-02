const { REACT_APP_DB_ID, REACT_APP_API_KEY } = process.env;
const API_URL = `https://api.airtable.com/v0/${REACT_APP_DB_ID}`;

async function request(endpoint, method = "GET", data = null) {
  const url = `${API_URL}${endpoint}`;
  const requestConfig = {
    method,
    headers: {
      Authorization: `Bearer ${REACT_APP_API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  if (method === "POST" || method === "PATCH")
    return (requestConfig.body = JSON.stringify(data));

  const response = await fetch(url, requestConfig);
  const responsedData = await response.json();

  return responsedData.records;
}

const get = (endpoint) => request(endpoint);

const post = (endpoint, data) => request(endpoint, "POST", data);

const patch = (endpoint, data) => request(endpoint, "PATCH", data);

const _delete = (endpoint) => request(endpoint, "DELETE");

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get,
  post,
  patch,
  delete: _delete,
};