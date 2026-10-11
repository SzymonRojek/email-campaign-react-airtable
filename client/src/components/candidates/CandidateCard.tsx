import { formattedData, isInteractiveClick } from "helpers";
import { useCandidatePanel } from "customHooks/useCandidatePanel";
import StatusBadge from "components/StatusBadge";
import { Candidate } from "types";
import CandidateRole from "./CandidateRole";
import LastContacted from "./LastContacted";
import CandidateActions from "./CandidateActions";
import CandidateIdentity from "./CandidateIdentity";

interface CandidateCardProps {
  candidate: Candidate;
  withActions: boolean;
  lastContacted?: string;
}

// a list row on a phone - the table is too wide there
const CandidateCard = ({ candidate, withActions, lastContacted }: CandidateCardProps) => {
  const { id, fields, createdTime } = candidate;
  const { open } = useCandidatePanel();

  return (
    <li
      onClick={(event) => !isInteractiveClick(event) && open(id)}
      className="grid cursor-pointer gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-start justify-between gap-3">
        <CandidateIdentity candidate={candidate} />
        <StatusBadge status={fields.status} />
      </div>
      <div className="pl-11 text-sm">
        <CandidateRole candidate={candidate} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {lastContacted ? (
            <>
              Contacted <LastContacted date={lastContacted} />
            </>
          ) : (
            "Never contacted"
          )}{" "}
          · added{" "}
          {formattedData.getFormattedDate(fields.date || createdTime)}
        </p>
        {withActions && <CandidateActions candidate={candidate} />}
      </div>
    </li>
  );
};

export default CandidateCard;
