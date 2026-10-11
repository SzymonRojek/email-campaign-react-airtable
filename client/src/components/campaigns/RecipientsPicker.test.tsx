import type { Mock } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import RecipientsPicker from "./RecipientsPicker";
import { useOutbox, useSubscribers } from "customHooks/queries";
import { useRecipients } from "customHooks/useRecipients";
import {
  GlobalStoreContextProvider,
  useGlobalStoreContext,
} from "contexts/GlobalStoreContextProvider";
import { Subscriber, SubscriberStatus } from "types";

vi.mock("customHooks/queries", () => ({ useSubscribers: vi.fn(), useOutbox: vi.fn() }));

const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY).toISOString();

const candidate = (
  id: string,
  name: string,
  status: SubscriberStatus,
  profession?: string,
  salary?: string
): Subscriber => ({
  id,
  createdTime: "2026-01-01T00:00:00.000Z",
  fields: { name, surname: "Nowak", email: `${name}@example.com`, status, profession, salary },
});

// what the form would send and the roles to pick from; the role buttons stand in for the
// select (Radix needs a real browser - the e2e tests click it)
const Probe = () => {
  const { receivers, roles } = useRecipients();
  const { updateRecipientFilter } = useGlobalStoreContext();

  return (
    <>
      <p data-testid="receivers">{receivers.map(({ id }) => id).join(",") || "none"}</p>
      <p data-testid="roles">{roles.join("|")}</p>
      <button onClick={() => updateRecipientFilter({ role: "Frontend Developer" })}>
        role: frontend
      </button>
    </>
  );
};

const renderPicker = () => {
  const user = userEvent.setup();

  render(
    <GlobalStoreContextProvider>
      <RecipientsPicker />
      <Probe />
    </GlobalStoreContextProvider>
  );

  return user;
};

const receivers = () => screen.getByTestId("receivers").textContent;

describe("RecipientsPicker", () => {
  beforeEach(() => {
    (useSubscribers as Mock).mockReturnValue({
      data: [
        candidate("1", "Anna", "active", "Frontend Developer", "17000"),
        candidate("2", "Bartek", "blocked", "Frontend Developer", "15000"),
        candidate("3", "Celina", "active", "Frontend Developer", "25000"),
        candidate("4", "Darek", "active", "QA Engineer", "12000"),
        // another letter case, no expected salary
        candidate("5", "Ewa", "active", "frontend developer"),
      ],
    });
    (useOutbox as Mock).mockReturnValue({
      data: [
        { id: "e1", subscriberId: "1", sentAt: daysAgo(3) },
        { id: "e2", subscriberId: "4", sentAt: daysAgo(30) },
      ],
    });
  });

  it("suggests everybody open to offers but skips the ones contacted in the last 14 days", async () => {
    const user = renderPicker();

    expect(receivers()).toBe("3,4,5");
    expect(screen.getByText("Goes to 3 candidates")).toBeInTheDocument();

    const skip = screen.getByLabelText("Skip 1 candidate contacted in the last 14 days");
    expect(skip).toBeChecked();
    await user.click(skip);

    expect(receivers()).toBe("1,3,4,5");
  });

  it("lists every role once, whatever the letter case", () => {
    renderPicker();

    expect(screen.getByTestId("roles")).toHaveTextContent("Frontend Developer|QA Engineer");
  });

  it("finds the candidates by the role and the budget", async () => {
    const user = renderPicker();

    await user.click(screen.getByRole("button", { name: "role: frontend" }));
    // Anna was contacted 3 days ago, Darek is a tester
    expect(receivers()).toBe("3,5");

    await user.type(screen.getByLabelText("Budget per month"), "20 000");
    // Celina expects more; Ewa gave no salary - she may still fit
    expect(screen.getByLabelText("Budget per month")).toHaveValue("20000");
    expect(receivers()).toBe("5");
    expect(screen.getByText("Goes to 1 candidate")).toBeInTheDocument();
  });

  it("keeps a candidate with no expected salary within any budget, until it is cleared", async () => {
    const user = renderPicker();

    await user.click(screen.getByRole("button", { name: "role: frontend" }));
    await user.type(screen.getByLabelText("Budget per month"), "100");
    expect(receivers()).toBe("5");

    await user.clear(screen.getByLabelText("Budget per month"));
    expect(receivers()).toBe("3,5");
  });

  it("lets the recruiter fine-tune the list by hand", async () => {
    const user = renderPicker();

    await user.click(screen.getByRole("button", { name: "Choose recipients" }));
    const dialog = screen.getByRole("dialog");

    // the contacted one is there, but not checked
    expect(within(dialog).getByText("3 of 4 selected")).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/Anna/)).not.toBeChecked();
    expect(within(dialog).getByText(/contacted 3 days ago/)).toBeInTheDocument();
    expect(within(dialog).queryByText(/Bartek/)).not.toBeInTheDocument();

    await user.click(within(dialog).getByLabelText(/Darek/));
    await user.click(within(dialog).getByRole("button", { name: "Done" }));

    expect(receivers()).toBe("3,5");
    expect(screen.getByText("Goes to 2 of 4 matching candidates - chosen by hand")).toBeInTheDocument();
    // chosen by hand - the skip option no longer applies
    expect(screen.queryByLabelText(/Skip/)).not.toBeInTheDocument();
  });

  it("keeps the suggestion when nothing is changed, and drops the changes on Cancel", async () => {
    const user = renderPicker();

    await user.click(screen.getByRole("button", { name: "Choose recipients" }));
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.getByText("Goes to 3 candidates")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Choose recipients" }));
    await user.click(screen.getByLabelText(/Celina/));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(receivers()).toBe("3,4,5");
  });

  it("asks for at least one candidate when everybody is unchecked", async () => {
    const user = renderPicker();

    await user.click(screen.getByRole("button", { name: "Choose recipients" }));
    const selectAll = screen.getByRole("checkbox", { name: "Select all" });
    // some are checked - "select all" checks everybody, then unchecks everybody
    await user.click(selectAll);
    expect(screen.getByText("4 of 4 selected")).toBeInTheDocument();
    await user.click(selectAll);

    expect(screen.getByText("Choose at least one candidate")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(receivers()).toBe("none");
  });

  it("a new filter drops the people chosen by hand", async () => {
    const user = renderPicker();

    await user.click(screen.getByRole("button", { name: "Choose recipients" }));
    await user.click(screen.getByLabelText(/Darek/));
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(receivers()).toBe("3,5");

    await user.click(screen.getByRole("button", { name: "role: frontend" }));
    expect(receivers()).toBe("3,5");
    expect(screen.getByText("Goes to 2 candidates")).toBeInTheDocument();
  });
});
