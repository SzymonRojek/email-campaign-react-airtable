import { MouseEvent } from "react";
import { useNavigate } from "react-router";

import { isInteractiveClick } from "helpers";
import { Campaign } from "types";

// where a campaign opens: a draft in the editor (like the drafts in an e-mail app),
// a sent one on its page with the recipients
export const campaignPath = ({ id, fields }: Campaign) =>
  fields.status === "draft" ? `/campaigns/edit/${id}` : `/campaigns/${id}`;

// a click anywhere in a campaign's row opens it
export const useOpenCampaign = (campaign: Campaign) => {
  const navigate = useNavigate();

  return (event: MouseEvent) => {
    if (!isInteractiveClick(event)) navigate(campaignPath(campaign));
  };
};
