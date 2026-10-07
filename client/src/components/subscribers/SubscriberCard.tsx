import { formattedData, isInteractiveClick } from "helpers";
import { useSubscriberPanel } from "customHooks/useSubscriberPanel";
import StatusBadge from "components/StatusBadge";
import { Subscriber } from "types";
import SubscriberActions from "./SubscriberActions";
import SubscriberIdentity from "./SubscriberIdentity";

interface SubscriberCardProps {
  subscriber: Subscriber;
  withActions: boolean;
}

// a list row on a phone - the table is too wide there
const SubscriberCard = ({ subscriber, withActions }: SubscriberCardProps) => {
  const { id, fields, createdTime } = subscriber;
  const { open } = useSubscriberPanel();

  return (
    <li
      onClick={(event) => !isInteractiveClick(event) && open(id)}
      className="grid cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-start justify-between gap-3">
        <SubscriberIdentity subscriber={subscriber} />
        <StatusBadge status={fields.status} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {formattedData.getFormattedDateTime(fields.date || createdTime)}
        </p>
        {withActions && <SubscriberActions subscriber={subscriber} />}
      </div>
    </li>
  );
};

export default SubscriberCard;
