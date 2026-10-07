import { formattedData } from "helpers";
import StatusBadge from "components/StatusBadge";
import { Subscriber } from "types";
import SubscriberActions from "./SubscriberActions";
import SubscriberName from "./SubscriberName";

interface SubscriberCardProps {
  subscriber: Subscriber;
  withActions: boolean;
}

// a list row on a phone - the table is too wide there
const SubscriberCard = ({ subscriber, withActions }: SubscriberCardProps) => {
  const { fields, createdTime } = subscriber;

  return (
    <li className="grid gap-2 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium">
          <SubscriberName subscriber={subscriber} /> {fields.surname}
        </p>
        <StatusBadge status={fields.status} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {formattedData.getFormattedDateTime(fields.date || createdTime)}
        </p>
        {withActions && <SubscriberActions subscriber={subscriber} />}
      </div>
    </li>
  );
};

export default SubscriberCard;
