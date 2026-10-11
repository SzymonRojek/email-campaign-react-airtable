import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useConfirmModalState } from "contexts/ConfirmModalContext";
import api from "../services/api";
import getErrorMessage from "../services/getErrorMessage";
import { toastMessage } from "helpers";
import { AirtableRecord } from "types";

type Item = AirtableRecord<unknown>;

export const useRemoveItem = (
  // the API path - also the key of the list in the cache
  query: "candidates" | "job-offers",
  // shown in the question, e.g. "Emma Johnson" or the job offer title
  name: string | undefined,
  id: string,
  // e.g. close the details panel of the removed candidate
  onRemoved?: () => void
) => {
  const queryClient = useQueryClient();

  const { setConfirmModalState, setConfirmModalText } = useConfirmModalState();

  const queryKey = [`/${query}`];

  const { mutateAsync } = useMutation({
    mutationFn: (id: string) => api.delete(`/${query}/${id}`),
    // remove the row at once, bring it back if the server fails
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });

      const previousItems = queryClient.getQueryData<Item[]>(queryKey);

      if (previousItems) {
        queryClient.setQueryData(
          queryKey,
          previousItems.filter((item) => item.id !== id)
        );
      }

      return { previousItems };
    },
    onError: (error, id, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(queryKey, context.previousItems);
      }

      toastMessage(`Item has not been removed: ${getErrorMessage(error)}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
      // a deleted job offer takes its e-mails along - "last contacted" changes
      if (query === "job-offers") queryClient.invalidateQueries({ queryKey: ["/outbox"] });
    },
  });

  const confirmModalProps = {
    onConfirm: () => {
      onRemoved?.();
      return mutateAsync(id);
    },
    onClose: () => setConfirmModalState({ isOpenConfirmModal: false }),
  };

  const handleConfirmModalData = () => {
    setConfirmModalState({
      confirmModalProps,
      isOpenConfirmModal: true,
    });
    setConfirmModalText({
      title: `Delete ${query === "candidates" ? "candidate" : "job offer"}?`,
      description: (
        <>
          <strong className="font-medium text-foreground">{name}</strong> will be
          removed permanently. This cannot be undone.
        </>
      ),
      confirmLabel: "Delete",
    });
  };

  return { handleConfirmModalData };
};
