import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { toastMessage } from "helpers";
import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { campaignsKey, outboxKey } from "customHooks/queries";
import { useRecipients } from "customHooks/useRecipients";
import { getErrorMessage, sendCampaign } from "services";
import { CampaignFormValues } from "types";

// "Send" on the new / edit campaign page: the outbox gets the e-mails, then the
// campaign page shows who got them
export const useSendCampaign = (id?: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { receivers } = useRecipients();
  const { resetRecipients } = useGlobalStoreContext();

  return async (values: CampaignFormValues) => {
    if (!receivers.length) {
      toastMessage("Please choose at least one candidate");
      return;
    }

    try {
      const campaignId = await sendCampaign({
        id,
        values,
        recipientIds: receivers.map((subscriber) => subscriber.id),
      });

      // the next job offer starts with no filter again
      resetRecipients();
      // "last contacted" changes for everybody who got it
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: campaignsKey }),
        queryClient.invalidateQueries({ queryKey: outboxKey }),
      ]);
      navigate(`/campaigns/${campaignId}`);
    } catch (error) {
      toastMessage(`The job offer has not been sent: ${getErrorMessage(error)}`);
    }
  };
};
