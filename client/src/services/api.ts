import { getToken, removeToken, UNAUTHORIZED_EVENT } from "./authToken";
import HttpError from "./HttpError";

type Method = "get" | "post" | "patch" | "delete";

// JSON when possible - a proxy in front of the server may answer with HTML or nothing
const parseBody = async (response: Response) => {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : undefined;
  } catch {
    return text;
  }
};

const request = async <T>(
  endpoint = "",
  method: Method = "get",
  data?: unknown
): Promise<T> => {
  const token = getToken();

  // all server endpoints live under /api - frontend routes keep the same paths
  const response = await fetch(`/api${endpoint}`, {
    method: method.toUpperCase(),
    headers: {
      "Content-type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...((method === "post" || method === "patch") && {
      body: JSON.stringify(data),
    }),
  });

  const body = await parseBody(response);

  if (!response.ok) {
    // token expired or invalid - log out the user (except a failed login attempt)
    if (response.status === 401 && endpoint !== "/auth/login") {
      removeToken();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }

    throw new HttpError(response.status, body);
  }

  return body as T;
};

const get = <T>(endpoint: string) => request<T>(endpoint);

const post = <T>(endpoint: string, data: unknown) =>
  request<T>(endpoint, "post", data);

const patch = <T>(endpoint: string, data: unknown) =>
  request<T>(endpoint, "patch", data);

const _delete = <T>(endpoint: string) => request<T>(endpoint, "delete");

export default {
  get,
  post,
  patch,
  delete: _delete,
};
