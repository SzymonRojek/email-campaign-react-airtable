import { formattedData } from "helpers";
import StatusBadge from "components/StatusBadge";
import { Campaign } from "types";
import CampaignActions from "./CampaignActions";

// a list row on a phone - the table is too wide there
const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
  const { fields, createdTime } = campaign;

  return (
    <li className="grid gap-2 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium">{fields.title}</p>
        <StatusBadge status={fields.status} />
      </div>
      <p className="text-sm text-muted-foreground">{fields.description}</p>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {formattedData.getFormattedDateTime(fields.date || createdTime)}
        </p>
        <CampaignActions campaign={campaign} />
      </div>
    </li>
  );
};

export default CampaignCard;
