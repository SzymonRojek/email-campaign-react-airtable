import type { Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import LoginForm from "./LoginForm";
import api from "services/api";
import { getToken } from "services/authToken";
import { ThemeProvider } from "contexts/ThemeContext";
import HttpError from "services/HttpError";
import {
  GlobalStoreContextProvider,
  useGlobalStoreContext,
} from "contexts/GlobalStoreContextProvider";

vi.mock("services/api", () => ({
  // the login page also asks for the feedback of the reviewers - none here
  default: { post: vi.fn(), get: vi.fn(() => Promise.resolve([])) },
}));

const mockedPost = api.post as Mock;

const LoginState = () => {
  const { isLogIn } = useGlobalStoreContext();

  return <p data-testid="login-state">{String(isLogIn)}</p>;
};

const renderLoginForm = () =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <ThemeProvider>
        <MemoryRouter>
          <GlobalStoreContextProvider>
            <LoginForm />
            <LoginState />
          </GlobalStoreContextProvider>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );

const tryDemo = () =>
  userEvent.setup().click(screen.getByRole("button", { name: "Try the demo" }));

describe("LoginForm", () => {
  beforeEach(() => {
    localStorage.clear();
    mockedPost.mockReset();
  });

  it("opens the demo with one click - no password", async () => {
    mockedPost.mockResolvedValue({ token: "demo-token" });
    renderLoginForm();

    await tryDemo();

    await waitFor(() =>
      expect(screen.getByTestId("login-state")).toHaveTextContent("true")
    );
    expect(mockedPost).toHaveBeenCalledWith("/auth/demo", {});
    expect(getToken()).toBe("demo-token");
  });

  it("shows the error when the demo can not be opened", async () => {
    mockedPost.mockRejectedValue(
      new HttpError(404, { error: "Endpoint does not exist" })
    );
    renderLoginForm();

    await tryDemo();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Endpoint does not exist"
    );
    expect(screen.getByTestId("login-state")).toHaveTextContent("false");
    expect(screen.getByRole("button", { name: "Try the demo" })).toBeEnabled();
  });

  it("asks for no password - the demo is the only way in from the browser", () => {
    renderLoginForm();

    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });
});
