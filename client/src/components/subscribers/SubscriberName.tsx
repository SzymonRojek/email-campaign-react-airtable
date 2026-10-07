import { Link } from "react-router";

import { Subscriber } from "types";

// an active subscriber's name opens the details - others have no details page
const SubscriberName = ({ subscriber }: { subscriber: Subscriber }) => {
  const { id, fields } = subscriber;

  if (fields.status !== "active") return <>{fields.name}</>;

  return (
    <Link
      to={`/subscribers/details/${id}`}
      className="underline-offset-4 hover:text-brand hover:underline"
    >
      {fields.name}
    </Link>
  );
};

export default SubscriberName;
