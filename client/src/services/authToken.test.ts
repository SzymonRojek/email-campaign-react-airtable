import { getToken, removeToken, setToken } from "./authToken";

describe("authToken", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    removeToken();
  });

  it("keeps the token in the browser's storage", () => {
    setToken("token-1");

    expect(localStorage.getItem("authToken")).toBe("token-1");
    expect(getToken()).toBe("token-1");
  });

  it("keeps the token for this tab when the browser blocks its storage", () => {
    const blocked = () => {
      throw new DOMException("The operation is insecure.", "SecurityError");
    };
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(blocked);
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(blocked);
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(blocked);

    setToken("token-2");
    expect(getToken()).toBe("token-2");

    removeToken();
    expect(getToken()).toBeNull();
  });

  it("logs out with another tab when the storage works", () => {
    setToken("token-3");

    // another tab logged out
    localStorage.removeItem("authToken");

    expect(getToken()).toBeNull();
  });
});
