import { formatSalary } from "helpers";
import { Subscriber } from "types";

// the role and the expected salary - what a recruiter looks for first
const CandidateRole = ({ subscriber }: { subscriber: Subscriber }) => {
  const { profession, salary } = subscriber.fields;

  if (!profession && !salary) return <span className="text-muted-foreground">-</span>;

  return (
    <div className="min-w-0">
      <p className="truncate">{profession || "-"}</p>
      {salary && (
        <p className="truncate text-xs text-muted-foreground">{formatSalary(salary)}</p>
      )}
    </div>
  );
};

export default CandidateRole;
