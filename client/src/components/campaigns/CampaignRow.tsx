import { formattedData } from "helpers";
import { useOpenCampaign } from "customHooks/useOpenCampaign";
import StatusBadge from "components/StatusBadge";
import { Campaign } from "types";
import { TableCell, TableRow } from "@/components/ui/table";
import CampaignActions from "./CampaignActions";
import CampaignTitle from "./CampaignTitle";

const CampaignRow = ({ campaign }: { campaign: Campaign }) => {
  const { fields, createdTime } = campaign;
  const onClick = useOpenCampaign(campaign);

  return (
    <TableRow onClick={onClick} className="cursor-pointer">
      <TableCell className="max-w-md pl-4 whitespace-normal">
        <p className="font-medium">
          <CampaignTitle campaign={campaign} />
        </p>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {fields.description}
        </p>
      </TableCell>
      <TableCell>
        <StatusBadge status={fields.status} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formattedData.getFormattedDateTime(fields.date || createdTime)}
      </TableCell>
      <TableCell className="pr-4">
        <CampaignActions campaign={campaign} />
      </TableCell>
    </TableRow>
  );
};

export default CampaignRow;
