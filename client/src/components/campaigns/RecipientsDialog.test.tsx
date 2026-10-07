import type { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RecipientsDialog from "./RecipientsDialog";
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
  const user = userEvent.setup();
  const close = vi.fn();

  render(
    <GlobalStoreContextProvider>
      <RecipientsDialog isOpen onClose={close} />
      <SelectedSubscribers />
    </GlobalStoreContextProvider>
  );

  return { close, user };
};

describe("RecipientsDialog", () => {
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

    const checkboxes = screen.getAllByRole("checkbox", { name: /Nowak/ });

    expect(checkboxes).toHaveLength(2);
    checkboxes.forEach((checkbox) => expect(checkbox).toBeChecked());
    expect(screen.getByRole("checkbox", { name: "Select all" })).toBeChecked();
    expect(screen.queryByText(/Bartek/)).not.toBeInTheDocument();
    expect(screen.getByText("2 of 2 selected")).toBeInTheDocument();
    expect(screen.getByTestId("selected")).toHaveTextContent("all");
  });

  it("selects only the checked subscribers", async () => {
    const { user } = renderPopup();

    await user.click(screen.getByLabelText(/Anna/));

    expect(screen.getByTestId("selected")).toHaveTextContent("3");
    expect(screen.getByText("1 of 2 selected")).toBeInTheDocument();
    // some selected - "select all" shows a minus
    expect(screen.getByRole("checkbox", { name: "Select all" })).toHaveAttribute(
      "data-state",
      "indeterminate"
    );
  });

  it("'select all' unchecks everybody, then checks everybody again", async () => {
    const { user } = renderPopup();
    const selectAll = screen.getByRole("checkbox", { name: "Select all" });

    await user.click(selectAll);

    expect(screen.getByTestId("selected")).toHaveTextContent("none");
    expect(screen.getByText("Choose at least one subscriber")).toBeInTheDocument();

    await user.click(selectAll);

    expect(screen.getByTestId("selected")).toHaveTextContent("1,3");
  });

  it("'select all' with some selected checks everybody", async () => {
    const { user } = renderPopup();

    await user.click(screen.getByLabelText(/Anna/));
    await user.click(screen.getByRole("checkbox", { name: "Select all" }));

    expect(screen.getByTestId("selected")).toHaveTextContent("1,3");
  });

  it("Cancel resets the selection, Done keeps it", async () => {
    const { close, user } = renderPopup();

    await user.click(screen.getByLabelText(/Anna/));
    await user.click(screen.getByRole("button", { name: "Done" }));

    expect(close).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("selected")).toHaveTextContent("3");

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByTestId("selected")).toHaveTextContent("all");
  });

  it("closing with X resets the selection to all active subscribers", async () => {
    const { close, user } = renderPopup();

    await user.click(screen.getByLabelText(/Anna/));
    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(close).toHaveBeenCalled();
    expect(screen.getByTestId("selected")).toHaveTextContent("all");
  });
});
