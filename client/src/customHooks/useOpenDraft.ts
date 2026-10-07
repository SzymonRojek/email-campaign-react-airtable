import { MouseEvent } from "react";
import { useNavigate } from "react-router";

import { isInteractiveClick } from "helpers";
import { Campaign } from "types";

// a click anywhere in a draft's row opens the editor - like the drafts in an e-mail app
export const useOpenDraft = ({ id, fields }: Campaign) => {
  const navigate = useNavigate();
  const isDraft = fields.status === "draft";

  return {
    isDraft,
    onClick: (event: MouseEvent) => {
      if (isDraft && !isInteractiveClick(event)) navigate(`/campaigns/edit/${id}`);
    },
  };
};
