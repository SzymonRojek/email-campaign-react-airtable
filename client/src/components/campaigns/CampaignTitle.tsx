import { Link } from "react-router";

import { campaignPath } from "customHooks/useOpenCampaign";
import { Campaign } from "types";

// the title opens the campaign (the keyboard way - a mouse can click the whole row)
const CampaignTitle = ({ campaign }: { campaign: Campaign }) => (
  <Link to={campaignPath(campaign)} className="underline-offset-4 hover:underline">
    {campaign.fields.title}
  </Link>
);

export default CampaignTitle;
