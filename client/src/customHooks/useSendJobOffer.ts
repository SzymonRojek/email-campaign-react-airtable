import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { toastMessage } from "helpers";
import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { jobOffersKey, outboxKey } from "customHooks/queries";
import { useRecipients } from "customHooks/useRecipients";
import { getErrorMessage, sendJobOffer } from "services";
import { JobOfferFormValues } from "types";

// "Send" on the new / edit job offer page: the outbox gets the e-mails, then the
// job offer page shows who got them
export const useSendJobOffer = (id?: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { receivers } = useRecipients();
  const { resetRecipients } = useGlobalStoreContext();

  return async (values: JobOfferFormValues) => {
    if (!receivers.length) {
      toastMessage("Please choose at least one candidate");
      return;
    }

    try {
      const jobOfferId = await sendJobOffer({
        id,
        values,
        recipientIds: receivers.map((candidate) => candidate.id),
      });

      // the next job offer starts with no filter again
      resetRecipients();
      // "last contacted" changes for everybody who got it
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: jobOffersKey }),
        queryClient.invalidateQueries({ queryKey: outboxKey }),
      ]);
      navigate(`/job-offers/${jobOfferId}`);
    } catch (error) {
      toastMessage(`The job offer has not been sent: ${getErrorMessage(error)}`);
    }
  };
};
