const baseUrl = "https://api.airtable.com/v0";
const { REACT_APP_DB_ID, REACT_APP_API_KEY } = process.env;

export const apiConfig = {
  subscribers: `${baseUrl}/${REACT_APP_DB_ID}/subscribers`,
  campaigns: `${baseUrl}/${REACT_APP_DB_ID}/campaigns`,
};

const requestConfig = {
  headers: {
    Authorization: `Bearer ${REACT_APP_API_KEY}`,
  },
};

export const getSubscribers = async (endpoint) => {
  const response = await fetch(endpoint, {
    method: "GET",
    ...requestConfig,
  });

  const data = await response.json();

  return data.records;
};

console.log(getSubscribers(apiConfig.subscribers));

// const API_URL = `https://api.airtable.com/v0/${process.env.REACT_APP_DB_ID}`;
// const apiKey = process.env.REACT_APP_API_KEY;

// function request(endpoint, method = "GET", data = null) {
//   const requestConfig = {
//     method,
//     headers: {
//       Authorization: `Bearer ${apiKey}`,
//       "Content-Type": "application/json",
//     },
//   };

//   if (method === "POST" || method === "PATCH") {
//     requestConfig.body = JSON.stringify(data);
//   }
//   const url = `${API_URL}${endpoint}`;

//   return fetch(url, requestConfig).then((response) => response.json());
// }

// function get(endpoint) {
//   return request(endpoint);
// }

// console.log(get("/subscribers?"));

// function post(endpoint, data) {
//   console.log(data);
//   return request(endpoint, "POST", data);
// }

// function patch(endpoint, data) {
//   return request(endpoint, "PATCH", data);
// }

// function _delete(endpoint) {
//   return request(endpoint, "DELETE");
// }

// // eslint-disable-next-line import/no-anonymous-default-export
// export default {
//   get,
//   post,
//   patch,
//   delete: _delete,
// };
