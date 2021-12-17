import axios from "axios";

const request = async (endpoint, method = "GET", data = null) => {
  const requestConfig = {
    method,
    url: `${endpoint}`,
    data: method === "POST" || method === "PATCH" ? data : null,
  };

  const response = await axios(requestConfig);

  if (!response) {
    throw new Error("Something happened - no data");
  }

  return response.data;
};

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

// const request = async (endpoint, method = "GET", data = null) => {
//   const requestConfig = {
//     method,
//   };

//   if (method === "POST" || method === "PATCH")
//     requestConfig.body = JSON.stringify(data);

//   const url = `http://localhost:3000${endpoint}`;

//   const response = await fetch(url, requestConfig);

//   const getData = await response.json();

//   if (!getData) {
//     throw new Error("Something happened - no data");
//   }

//   return getData;
// };

// const get = (endpoint) => request(endpoint);

// const post = (endpoint, data) => request(endpoint, "POST", data);

// const patch = (endpoint, data) => request(endpoint, "PATCH", data);

// const _delete = (endpoint) => request(endpoint, "DELETE");

// // eslint-disable-next-line import/no-anonymous-default-export
// export default {
//   get,
//   post,
//   patch,
//   delete: _delete,
// };
