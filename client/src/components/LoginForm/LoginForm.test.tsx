import type { Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import LoginForm from "./LoginForm";
import api from "services/api";
import { getToken } from "services/authToken";
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
    <MemoryRouter>
      <GlobalStoreContextProvider>
        <LoginForm />
        <LoginState />
      </GlobalStoreContextProvider>
    </MemoryRouter>
  );

const fillPasswords = (password: string, confirmPassword = password) => {
  userEvent.type(screen.getByLabelText("password*"), password);
  userEvent.type(screen.getByLabelText("confirmPassword*"), confirmPassword);
  userEvent.click(screen.getByRole("button", { name: /log in/i }));
};

describe("LoginForm", () => {
  beforeEach(() => {
    localStorage.clear();
    mockedPost.mockReset();
  });

  it("logs in with the token returned by the server", async () => {
    mockedPost.mockResolvedValue({ token: "server-token" });
    renderLoginForm();

    fillPasswords("secret-password");

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
      Object.assign(new Error("Request failed with status code 401"), {
        response: { status: 401, data: { error: "password is not correct" } },
      })
    );
    renderLoginForm();

    fillPasswords("wrong");

    expect(
      await screen.findByText("password is not correct")
    ).toBeInTheDocument();
    expect(screen.getByTestId("login-state")).toHaveTextContent("false");
    expect(getToken()).toBeNull();
  });

  it("does not call the server when the passwords do not match", async () => {
    renderLoginForm();

    fillPasswords("secret", "other");

    expect(await screen.findByText("passwords don't match.")).toBeInTheDocument();
    expect(mockedPost).not.toHaveBeenCalled();
  });
});
