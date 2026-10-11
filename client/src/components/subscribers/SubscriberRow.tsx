import { formattedData, isInteractiveClick } from "helpers";
import { useSubscriberPanel } from "customHooks/useSubscriberPanel";
import StatusBadge from "components/StatusBadge";
import { Subscriber } from "types";
import { TableCell, TableRow } from "@/components/ui/table";
import CandidateRole from "./CandidateRole";
import LastContacted from "./LastContacted";
import SubscriberActions from "./SubscriberActions";
import SubscriberIdentity from "./SubscriberIdentity";

interface SubscriberRowProps {
  subscriber: Subscriber;
  withActions: boolean;
  lastContacted?: string;
}

const SubscriberRow = ({ subscriber, withActions, lastContacted }: SubscriberRowProps) => {
  const { id, fields, createdTime } = subscriber;
  const { open } = useSubscriberPanel();

  return (
    // the whole row opens the details panel (the name link does it for the keyboard)
    <TableRow
      onClick={(event) => !isInteractiveClick(event) && open(id)}
      className="cursor-pointer"
    >
      <TableCell className="max-w-72 pl-4">
        <SubscriberIdentity subscriber={subscriber} />
      </TableCell>
      <TableCell className="max-w-48">
        <CandidateRole subscriber={subscriber} />
      </TableCell>
      <TableCell>
        <StatusBadge status={fields.status} />
      </TableCell>
      <TableCell>
        <LastContacted date={lastContacted} />
      </TableCell>
      <TableCell className="hidden text-muted-foreground lg:table-cell">
        {formattedData.getFormattedDateTime(fields.date || createdTime)}
      </TableCell>
      {withActions && (
        <TableCell className="pr-4">
          <SubscriberActions subscriber={subscriber} />
        </TableCell>
      )}
    </TableRow>
  );
};

export default SubscriberRow;
