import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeProvider } from "contexts/ThemeContext";
import ThemeToggle from "./ThemeToggle";

const renderToggle = () =>
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("follows the system by default", () => {
    renderToggle();

    expect(screen.getByRole("radio", { name: "System" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("switches to dark and remembers it", async () => {
    renderToggle();

    await userEvent.click(screen.getByRole("radio", { name: "Dark" }));

    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("starts with the saved theme and switches back to light", async () => {
    localStorage.setItem("theme", "dark");
    renderToggle();

    expect(document.documentElement).toHaveClass("dark");

    await userEvent.click(screen.getByRole("radio", { name: "Light" }));

    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
