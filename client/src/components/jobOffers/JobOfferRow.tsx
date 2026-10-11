import { formattedData } from "helpers";
import { useOpenJobOffer } from "customHooks/useOpenJobOffer";
import StatusBadge from "components/StatusBadge";
import { JobOffer } from "types";
import { TableCell, TableRow } from "@/components/ui/table";
import JobOfferActions from "./JobOfferActions";

const JobOfferRow = ({ jobOffer }: { jobOffer: JobOffer }) => {
  const { fields, createdTime } = jobOffer;
  const onClick = useOpenJobOffer(jobOffer);

  return (
    <TableRow onClick={onClick} className="cursor-pointer">
      <TableCell className="max-w-md pl-4 whitespace-normal">
        <p className="font-medium">
          {fields.subject}
        </p>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {fields.message}
        </p>
      </TableCell>
      <TableCell>
        <StatusBadge status={fields.status} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formattedData.getFormattedDateTime(fields.date || createdTime)}
      </TableCell>
      <TableCell className="pr-4">
        <JobOfferActions jobOffer={jobOffer} />
      </TableCell>
    </TableRow>
  );
};

export default JobOfferRow;
