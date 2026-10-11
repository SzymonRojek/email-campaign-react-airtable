import { formattedData, isInteractiveClick } from "helpers";
import { useCandidatePanel } from "customHooks/useCandidatePanel";
import StatusBadge from "components/StatusBadge";
import { Candidate } from "types";
import { TableCell, TableRow } from "@/components/ui/table";
import CandidateRole from "./CandidateRole";
import LastContacted from "./LastContacted";
import CandidateActions from "./CandidateActions";
import CandidateIdentity from "./CandidateIdentity";

interface CandidateRowProps {
  candidate: Candidate;
  withActions: boolean;
  lastContacted?: string;
}

const CandidateRow = ({ candidate, withActions, lastContacted }: CandidateRowProps) => {
  const { id, fields, createdTime } = candidate;
  const { open } = useCandidatePanel();

  return (
    // the whole row opens the details panel (the name link does it for the keyboard)
    <TableRow
      onClick={(event) => !isInteractiveClick(event) && open(id)}
      className="cursor-pointer"
    >
      <TableCell className="max-w-72 pl-4">
        <CandidateIdentity candidate={candidate} />
      </TableCell>
      <TableCell className="max-w-48">
        <CandidateRole candidate={candidate} />
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
          <CandidateActions candidate={candidate} />
        </TableCell>
      )}
    </TableRow>
  );
};

export default CandidateRow;
