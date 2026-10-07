import { formattedData } from "helpers";
import StatusBadge from "components/StatusBadge";
import { Campaign } from "types";
import { TableCell, TableRow } from "@/components/ui/table";
import CampaignActions from "./CampaignActions";

interface CampaignRowProps {
  campaign: Campaign;
  number: number;
}

const CampaignRow = ({ campaign, number }: CampaignRowProps) => {
  const { fields, createdTime } = campaign;

  return (
    <TableRow>
      <TableCell className="w-10 text-muted-foreground">{number}</TableCell>
      <TableCell className="font-medium">{fields.title}</TableCell>
      <TableCell className="max-w-xs whitespace-normal text-muted-foreground">
        {fields.description}
      </TableCell>
      <TableCell>
        {formattedData.getFormattedDateTime(fields.date || createdTime)}
      </TableCell>
      <TableCell>
        <StatusBadge status={fields.status} />
      </TableCell>
      <TableCell>
        <CampaignActions campaign={campaign} />
      </TableCell>
    </TableRow>
  );
};

export default CampaignRow;
