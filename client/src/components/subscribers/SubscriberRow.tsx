import { formattedData } from "helpers";
import StatusBadge from "components/StatusBadge";
import { Subscriber } from "types";
import { TableCell, TableRow } from "@/components/ui/table";
import SubscriberActions from "./SubscriberActions";
import SubscriberName from "./SubscriberName";

interface SubscriberRowProps {
  subscriber: Subscriber;
  number: number;
  withActions: boolean;
}

const SubscriberRow = ({ subscriber, number, withActions }: SubscriberRowProps) => {
  const { fields, createdTime } = subscriber;

  return (
    <TableRow>
      <TableCell className="w-10 text-muted-foreground">{number}</TableCell>
      <TableCell className="font-medium">
        <SubscriberName subscriber={subscriber} />
      </TableCell>
      <TableCell>{fields.surname}</TableCell>
      <TableCell>
        <StatusBadge status={fields.status} />
      </TableCell>
      <TableCell>
        {formattedData.getFormattedDateTime(fields.date || createdTime)}
      </TableCell>
      {withActions && (
        <TableCell>
          <SubscriberActions subscriber={subscriber} />
        </TableCell>
      )}
    </TableRow>
  );
};

export default SubscriberRow;
