import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";

import { getToken, removeToken, UNAUTHORIZED_EVENT } from "./authToken";

const request = async <T>(
  endpoint = "",
  method: Method = "get",
  data?: unknown
): Promise<T> => {
  const token = getToken();

  const requestConfig: AxiosRequestConfig = {
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
    if (
      (error as AxiosError).response?.status === 401 &&
      endpoint !== "/auth/login"
    ) {
      removeToken();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

    throw error;
  }
};

const get = <T>(endpoint: string) => request<T>(endpoint);

const post = <T>(endpoint: string, data: unknown) =>
  request<T>(endpoint, "post", data);

const patch = <T>(endpoint: string, data: unknown) =>
  request<T>(endpoint, "patch", data);

const _delete = <T>(endpoint: string) => request<T>(endpoint, "delete");

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  get,
  post,
  patch,
  delete: _delete,
};
