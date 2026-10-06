const TOKEN_KEY = "authToken";

export const UNAUTHORIZED_EVENT = "unauthorized";

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    // no localStorage (e.g. private mode)
    return null;
  }
};

export const setToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // no localStorage (e.g. private mode) - the user just has to log in again
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // no localStorage (e.g. private mode) - nothing to remove
  }
};
