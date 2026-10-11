import { formatSalary } from "helpers";
import { Candidate } from "types";

// the role and the expected salary - what a recruiter looks for first
const CandidateRole = ({ candidate }: { candidate: Candidate }) => {
  const { role, expectedSalary } = candidate.fields;

  if (!role && !expectedSalary) return <span className="text-muted-foreground">-</span>;

  return (
    <div className="min-w-0">
      <p className="truncate">{role || "-"}</p>
      {expectedSalary && (
        <p className="truncate text-xs text-muted-foreground">{formatSalary(expectedSalary)}</p>
      )}
    </div>
  );
};

export default CandidateRole;
