import { formattedData } from "helpers";
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
  const { fields, createdTime } = subscriber;

  return (
    <li className="grid gap-3 px-4 py-3">
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
