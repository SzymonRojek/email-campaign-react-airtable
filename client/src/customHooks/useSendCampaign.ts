import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { toastMessage } from "helpers";
import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { campaignsKey } from "customHooks/queries";
import { useRecipients } from "customHooks/useRecipients";
import { getErrorMessage, sendCampaign } from "services";
import { trackEvent } from "../analytics";
import { CampaignFormValues } from "types";

// "Send" on the new / edit campaign page: the outbox gets the e-mails, then the
// campaign page shows who got them
export const useSendCampaign = (id?: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { receivers } = useRecipients();
  const { setFinalSelectedActiveSubscribers } = useGlobalStoreContext();

  return async (values: CampaignFormValues) => {
    if (!receivers.length) {
      toastMessage("Please choose at least one subscriber");
      return;
    }

    try {
      const campaignId = await sendCampaign({
        id,
        values,
        recipientIds: receivers.map((subscriber) => subscriber.id),
      });

      trackEvent("campaign-sent");
      // the next campaign starts with all active subscribers again
      setFinalSelectedActiveSubscribers(null);
      await queryClient.invalidateQueries({ queryKey: campaignsKey });
      navigate(`/campaigns/${campaignId}`);
    } catch (error) {
      toastMessage(`The campaign has not been sent: ${getErrorMessage(error)}`);
    }
  };
};
