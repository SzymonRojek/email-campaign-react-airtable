import { Link } from "react-router";

import { subscriberPanelLink } from "customHooks/useSubscriberPanel";
import { Subscriber } from "types";

// the name opens the details panel - the keyboard / screen reader way to it
// (a mouse can click the whole row)
const SubscriberName = ({ subscriber }: { subscriber: Subscriber }) => {
  const { id, fields } = subscriber;
  const { to, state } = subscriberPanelLink(id);

  return (
    <Link to={to} state={state} className="underline-offset-4 hover:underline">
      {fields.name} {fields.surname}
    </Link>
  );
};

export default SubscriberName;
