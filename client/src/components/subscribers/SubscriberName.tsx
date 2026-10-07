import { Link } from "react-router";

import { Subscriber } from "types";

// an active subscriber's name opens the details - others have no details page
const SubscriberName = ({ subscriber }: { subscriber: Subscriber }) => {
  const { id, fields } = subscriber;
  const fullName = `${fields.name} ${fields.surname}`;

  if (fields.status !== "active") return <>{fullName}</>;

  return (
    <Link
      to={`/subscribers/details/${id}`}
      className="underline-offset-4 hover:underline"
    >
      {fullName}
    </Link>
  );
};

export default SubscriberName;
