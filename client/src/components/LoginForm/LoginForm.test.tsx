import type { Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

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
  default: { post: vi.fn() },
}));

const mockedPost = api.post as Mock;

const LoginState = () => {
  const { isLogIn } = useGlobalStoreContext();

  return <p data-testid="login-state">{String(isLogIn)}</p>;
};

const renderLoginForm = () =>
  render(
    <ThemeProvider>
      <MemoryRouter>
        <GlobalStoreContextProvider>
          <LoginForm />
          <LoginState />
        </GlobalStoreContextProvider>
      </MemoryRouter>
    </ThemeProvider>
  );

const logIn = async (password?: string) => {
  const user = userEvent.setup();

  if (password) await user.type(screen.getByLabelText("Password"), password);
  await user.click(screen.getByRole("button", { name: /log in/i }));
};

describe("LoginForm", () => {
  beforeEach(() => {
    localStorage.clear();
    mockedPost.mockReset();
  });

  it("logs in with the token returned by the server", async () => {
    mockedPost.mockResolvedValue({ token: "server-token" });
    renderLoginForm();

    await logIn("secret-password");

    await waitFor(() =>
      expect(screen.getByTestId("login-state")).toHaveTextContent("true")
    );
    expect(mockedPost).toHaveBeenCalledWith("/auth/login", {
      password: "secret-password",
    });
    expect(getToken()).toBe("server-token");
  });

  it("shows the error from the server for a wrong password", async () => {
    mockedPost.mockRejectedValue(
      new HttpError(401, { error: "password is not correct" })
    );
    renderLoginForm();

    await logIn("wrong");

    expect(
      await screen.findByText("password is not correct")
    ).toBeInTheDocument();
    expect(screen.getByTestId("login-state")).toHaveTextContent("false");
    expect(getToken()).toBeNull();
  });

  it("asks for a password before calling the server", async () => {
    renderLoginForm();

    await logIn();

    expect(
      await screen.findByText("please enter your password")
    ).toBeInTheDocument();
    expect(mockedPost).not.toHaveBeenCalled();
  });

  it("asks only for the password - no confirmation on a login form", () => {
    renderLoginForm();

    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.queryByLabelText("Confirm password")).not.toBeInTheDocument();
  });
});
