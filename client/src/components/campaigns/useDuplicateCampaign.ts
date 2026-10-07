import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { toastMessage, toastSuccess } from "helpers";
import { campaignsKey } from "customHooks/queries";
import { getErrorMessage } from "services";
import api from "services/api";
import { Campaign } from "types";

const SUFFIX = " (copy)";
// the same limit as the campaign form
const MAX_TITLE = 30;

// "Welcome" -> a new draft "Welcome (copy)", opened in the editor to be changed
export const useDuplicateCampaign = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: ({ fields }: Campaign) =>
      api.post<Campaign>("/campaigns", {
        fields: {
          title: `${fields.title.slice(0, MAX_TITLE - SUFFIX.length)}${SUFFIX}`,
          description: fields.description,
          status: "draft",
        },
      }),
    onSuccess: (copy) => {
      queryClient.invalidateQueries({ queryKey: campaignsKey });
      toastSuccess(`Draft "${copy.fields.title}" created - change it and send it`);
      navigate(`/campaigns/edit/${copy.id}`);
    },
    onError: (error) =>
      toastMessage(`The campaign has not been duplicated: ${getErrorMessage(error)}`),
  });

  return mutate;
};
