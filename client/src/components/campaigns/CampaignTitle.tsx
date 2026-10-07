import { Link } from "react-router";

import { Campaign } from "types";

// a draft's title opens the editor (the keyboard way - a mouse can click the row);
// a sent campaign can not be changed
const CampaignTitle = ({ campaign: { id, fields } }: { campaign: Campaign }) =>
  fields.status === "draft" ? (
    <Link to={`/campaigns/edit/${id}`} className="underline-offset-4 hover:underline">
      {fields.title}
    </Link>
  ) : (
    <>{fields.title}</>
  );

export default CampaignTitle;
