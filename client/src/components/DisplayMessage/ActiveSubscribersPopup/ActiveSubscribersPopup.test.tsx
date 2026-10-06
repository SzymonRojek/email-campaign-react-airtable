import type { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ActiveSubscribersPopup from "./ActiveSubscribersPopup";
import { useSubscribers } from "customHooks/queries";
import {
  GlobalStoreContextProvider,
  useGlobalStoreContext,
} from "contexts/GlobalStoreContextProvider";
import { Subscriber, SubscriberStatus } from "types";

vi.mock("customHooks/queries", () => ({ useSubscribers: vi.fn() }));

const subscriber = (
  id: string,
  name: string,
  status: SubscriberStatus
): Subscriber => ({
  id,
  createdTime: "2022-01-01T00:00:00.000Z",
  fields: { name, surname: "Nowak", email: `${name}@b.pl`, status },
});

// shows which subscribers would receive the email (null = all active)
const SelectedSubscribers = () => {
  const { finalSelectedActiveSubscribers } = useGlobalStoreContext();

  return (
    <p data-testid="selected">
      {finalSelectedActiveSubscribers === null
        ? "all"
        : finalSelectedActiveSubscribers.map(({ id }) => id).join(",") ||
          "none"}
    </p>
  );
};

const renderPopup = () => {
  const close = vi.fn();

  render(
    <GlobalStoreContextProvider>
      <ActiveSubscribersPopup
        openListActiveSubscribers
        closeListActiveSusbcribers={close}
      />
      <SelectedSubscribers />
    </GlobalStoreContextProvider>
  );

  return { close };
};

describe("ActiveSubscribersPopup", () => {
  beforeEach(() => {
    (useSubscribers as Mock).mockReturnValue({
      data: [
        subscriber("1", "Anna", "active"),
        subscriber("2", "Bartek", "blocked"),
        subscriber("3", "Celina", "active"),
      ],
    });
  });

  it("lists only active subscribers, all checked by default", () => {
    renderPopup();

    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes).toHaveLength(2);
    checkboxes.forEach((checkbox) => expect(checkbox).toBeChecked());
    expect(screen.queryByText(/Bartek/)).not.toBeInTheDocument();
    expect(screen.getByText("Checked subscribers: 2")).toBeInTheDocument();
    expect(screen.getByTestId("selected")).toHaveTextContent("all");
  });

  it("selects only the checked subscribers", () => {
    renderPopup();

    userEvent.click(screen.getByLabelText(/Anna/));

    expect(screen.getByTestId("selected")).toHaveTextContent("3");
    expect(screen.getByText("Checked subscribers: 1")).toBeInTheDocument();
  });

  it("'uncheck all' selects nobody instead of everybody", () => {
    renderPopup();

    userEvent.click(screen.getByRole("button", { name: "unchecked" }));

    expect(screen.getByTestId("selected")).toHaveTextContent("none");
    expect(screen.getByText("Please choose subscribers")).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: "checked" }));

    expect(screen.getByTestId("selected")).toHaveTextContent("1,3");
  });

  it("closing with X resets the selection to all active subscribers", () => {
    const { close } = renderPopup();

    userEvent.click(screen.getByLabelText(/Anna/));
    userEvent.click(screen.getByRole("button", { name: "close" }));

    expect(close).toHaveBeenCalledWith(false);
    expect(screen.getByTestId("selected")).toHaveTextContent("all");
  });
});
