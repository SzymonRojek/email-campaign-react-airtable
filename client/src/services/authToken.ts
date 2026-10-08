const TOKEN_KEY = "authToken";

// when the browser blocks its storage (e.g. Safari with "Block All Cookies", some in-app
// browsers) the token lives only in this tab - the visitor stays logged in until it closes
let tokenInMemory: string | null = null;

export const UNAUTHORIZED_EVENT = "unauthorized";

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? tokenInMemory;
  } catch {
    return tokenInMemory;
  }
};

export const setToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    // saved - a log out in another tab (it empties the storage) logs this tab out too
    tokenInMemory = null;
  } catch {
    // storage blocked - the token in memory is enough for this tab
    tokenInMemory = token;
  }
};

export const removeToken = () => {
  tokenInMemory = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // no localStorage (e.g. private mode) - nothing to remove
  }
};
