import { formattedData } from "helpers";
import { useOpenJobOffer } from "customHooks/useOpenJobOffer";
import StatusBadge from "components/StatusBadge";
import { JobOffer } from "types";
import JobOfferActions from "./JobOfferActions";

// a list row on a phone - the table is too wide there
const JobOfferCard = ({ jobOffer }: { jobOffer: JobOffer }) => {
  const { fields, createdTime } = jobOffer;
  const onClick = useOpenJobOffer(jobOffer);

  return (
    <li
      onClick={onClick}
      className="grid cursor-pointer gap-2 px-4 py-3 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium">
          {fields.subject}
        </p>
        <StatusBadge status={fields.status} />
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {fields.message}
      </p>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {formattedData.getFormattedDateTime(fields.date || createdTime)}
        </p>
        <JobOfferActions jobOffer={jobOffer} />
      </div>
    </li>
  );
};

export default JobOfferCard;
