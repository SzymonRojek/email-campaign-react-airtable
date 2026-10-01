import axios from "axios";

import { getToken, removeToken, UNAUTHORIZED_EVENT } from "./authToken";

const request = async (endpoint = "", method = "get", data) => {
  const token = getToken();

  const requestConfig = {
    method,
    // all server endpoints live under /api - frontend routes keep the same paths
    baseURL: "/api",
    url: endpoint,
    headers: {
      "Content-type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    data: method === "post" || method === "patch" ? data : {},
  };

  try {
    const response = await axios(requestConfig);

    return response.data;
  } catch (error) {
    // token expired or invalid - log out the user (except a failed login attempt)
    if (error.response?.status === 401 && endpoint !== "/auth/login") {
      removeToken();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

    throw error;
  }
};

const get = (endpoint) => request(endpoint);

const post = (endpoint, data) => request(endpoint, "post", data);

const patch = (endpoint, data) => request(endpoint, "patch", data);

const _delete = (endpoint) => request(endpoint, "delete");

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get,
  post,
  patch,
  delete: _delete,
};
