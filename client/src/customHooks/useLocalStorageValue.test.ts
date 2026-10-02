import { act, renderHook } from "@testing-library/react-hooks";

import { useLocalStorageValue } from "./useLocalStorageValue";

describe("useLocalStorageValue", () => {
  beforeEach(() => localStorage.clear());

  it("uses the default value and saves it", () => {
    const { result } = renderHook(() => useLocalStorageValue("key", "default"));

    expect(result.current[0]).toBe("default");
    expect(localStorage.getItem("key")).toBe('"default"');
  });

  it("reads a saved value", () => {
    localStorage.setItem("key", JSON.stringify({ a: 1 }));

    const { result } = renderHook(() => useLocalStorageValue("key", {}));

    expect(result.current[0]).toEqual({ a: 1 });
  });

  it("saves updates", () => {
    const { result } = renderHook(() => useLocalStorageValue("key", 1));

    act(() => result.current[1](2));

    expect(result.current[0]).toBe(2);
    expect(localStorage.getItem("key")).toBe("2");
  });

  it("parses the saved value (e.g. logged in only with a token)", () => {
    localStorage.setItem("login", "true");

    const { result } = renderHook(() =>
      useLocalStorageValue("login", false, (value) => value && false)
    );

    expect(result.current[0]).toBe(false);
  });

  it("falls back to the default value for broken json", () => {
    localStorage.setItem("key", "{broken");

    const { result } = renderHook(() => useLocalStorageValue("key", "default"));

    expect(result.current[0]).toBe("default");
  });
});
