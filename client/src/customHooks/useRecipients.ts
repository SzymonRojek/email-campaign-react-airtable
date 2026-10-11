import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { useSubscribers } from "customHooks/queries";
import { useLastContacted } from "customHooks/useLastContacted";
import { normalizeText, pluralize } from "helpers";
import { isRecentlyContacted } from "helpers/lastContacted";
import { Subscriber } from "types";

const sameRole = (a = "", b = "") => normalizeText(a) === normalizeText(b);

// within the budget - a candidate who gave no expected salary may still fit
const fitsBudget = (salary: string | undefined, maxSalary: string) =>
  !maxSalary || !salary || Number(salary) <= Number(maxSalary);

// who gets a job offer: the candidates open to offers that match the role and the budget,
// without the ones contacted in the last 14 days - or the people chosen by hand among them
export const useRecipients = () => {
  const { data: subscribers } = useSubscribers();
  const lastContacted = useLastContacted();
  const { recipientFilter: filter, chosenRecipientIds } = useGlobalStoreContext();

  const activeSubscribers = (subscribers ?? []).filter(
    ({ fields }) => fields.status === "active"
  );

  // the roles to pick from - each one once, as it is first written
  const roles = activeSubscribers
    .map(({ fields }) => fields.profession?.trim() ?? "")
    .filter((role, index, all) => role && all.findIndex((other) => sameRole(other, role)) === index)
    .sort((a, b) => a.localeCompare(b));

  const matching = activeSubscribers.filter(
    ({ fields }) =>
      (!filter.role || sameRole(fields.profession, filter.role)) &&
      fitsBudget(fields.salary, filter.maxSalary)
  );

  const isRecent = ({ id }: Subscriber) => isRecentlyContacted(lastContacted.get(id));
  const recent = matching.filter(isRecent);
  const suggested = filter.skipRecent ? matching.filter((s) => !isRecent(s)) : matching;

  const chosen = chosenRecipientIds && new Set(chosenRecipientIds);
  const receivers = chosen ? matching.filter(({ id }) => chosen.has(id)) : suggested;

  // the list is loaded and there is nobody to send to
  const hasNoActiveSubscribers = Boolean(subscribers) && activeSubscribers.length === 0;

  const label = hasNoActiveSubscribers
    ? "No candidates open to offers"
    : matching.length === 0
      ? "No candidate matches - change the role or the budget"
      : chosen
        ? `Goes to ${receivers.length} of ${pluralize(matching.length, "matching candidate")} - chosen by hand`
        : `Goes to ${pluralize(receivers.length, "candidate")}`;

  return {
    activeSubscribers,
    roles,
    matching,
    recent,
    suggested,
    receivers,
    lastContacted,
    isChosenByHand: Boolean(chosen),
    hasNoActiveSubscribers,
    label,
  };
};
