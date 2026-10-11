import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { toastMessage } from "helpers";
import { jobOffersKey } from "customHooks/queries";
import { getErrorMessage } from "services";
import api from "services/api";
import { JobOffer } from "types";

const SUFFIX = " (copy)";
// the same limit as the job offer form
const MAX_SUBJECT = 30;

// "Welcome" -> a new draft "Welcome (copy)", opened in the editor to be changed
export const useDuplicateJobOffer = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: ({ fields }: JobOffer) =>
      api.post<JobOffer>("/job-offers", {
        fields: {
          subject: `${fields.subject.slice(0, MAX_SUBJECT - SUFFIX.length)}${SUFFIX}`,
          message: fields.message,
          status: "draft",
        },
      }),
    // the editor with "... (copy)" in the subject says what happened - no toast
    onSuccess: (copy) => {
      queryClient.invalidateQueries({ queryKey: jobOffersKey });
      navigate(`/job-offers/edit/${copy.id}`);
    },
    onError: (error) =>
      toastMessage(`The job offer has not been duplicated: ${getErrorMessage(error)}`),
  });

  return mutate;
};
