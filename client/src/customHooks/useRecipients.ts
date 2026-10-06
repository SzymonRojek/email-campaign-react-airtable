import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { useSubscribers } from "customHooks/queries";

// who gets a campaign: the subscribers chosen in the dialog, or all active ones
export const useRecipients = () => {
  const { data: subscribers } = useSubscribers();
  const { finalSelectedActiveSubscribers } = useGlobalStoreContext();

  const activeSubscribers = (subscribers ?? []).filter(
    ({ fields }) => fields.status === "active"
  );
  const receivers = finalSelectedActiveSubscribers ?? activeSubscribers;
  // the list is loaded and there is nobody to send to
  const hasNoActiveSubscribers =
    Boolean(subscribers) && activeSubscribers.length === 0;

  const label = hasNoActiveSubscribers
    ? "no active subscribers"
    : finalSelectedActiveSubscribers
    ? `selected subscribers: ${finalSelectedActiveSubscribers.length} from ${activeSubscribers.length}`
    : `active subscribers - ${activeSubscribers.length}`;

  return { activeSubscribers, receivers, hasNoActiveSubscribers, label };
};
