import axios from "axios";

const request = async (endpoint = "", method = "get", data) => {
  const requestConfig = {
    method,
    url: endpoint,
    headers: {
      "Content-type": "application/json",
    },
    data: method === "post" || method === "patch" ? data : {},
  };

  const response = await axios(requestConfig);

  // if (!response) {
  //   throw new Error("Something happened - no data");
  // }

  return response.data;
};

const get = (endpoint) => request(endpoint);

const post = (endpoint, data) => request(endpoint, "post", data);

const patch = (endpoint, data) => request(endpoint, "patch", data);

const _delete = (endpoint) => request(endpoint, "delete");

const fetchDetailsItemById = async ({ queryKey }) => {
  const [key, { id }] = queryKey;
  const response = await get(`${key}/${id}`);

  return response;
};

const fetchItems = async ({ queryKey }) => {
  const [key] = queryKey;
  const response = await get(`${key}`);

  return response;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  fetchDetailsItemById,
  fetchItems,
  get,
  post,
  patch,
  delete: _delete,
};
