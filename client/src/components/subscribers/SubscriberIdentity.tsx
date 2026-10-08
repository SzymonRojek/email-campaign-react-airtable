import Avatar from "components/Avatar";
import { Subscriber } from "types";

// avatar, name and e-mail - the first column of the list and the top of a card
const SubscriberIdentity = ({ subscriber }: { subscriber: Subscriber }) => {
  const { fields } = subscriber;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={fields.name} surname={fields.surname} />
      <div className="min-w-0">
        <p className="truncate font-medium">
          {fields.name} {fields.surname}
        </p>
        <p className="truncate text-xs text-muted-foreground">{fields.email}</p>
      </div>
    </div>
  );
};

export default SubscriberIdentity;
