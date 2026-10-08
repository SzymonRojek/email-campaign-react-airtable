import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useConfirmModalState } from "contexts/ConfirmModalContext";
import api from "../services/api";
import getErrorMessage from "../services/getErrorMessage";
import { toastMessage } from "helpers";
import { AirtableRecord } from "types";

type Item = AirtableRecord<unknown>;

export const useRemoveItem = (
  query: "subscribers" | "campaigns",
  // shown in the question, e.g. "Emma Johnson" or the campaign title
  name: string | undefined,
  id: string,
  // e.g. close the details panel of the removed subscriber
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
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
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
      title: `Delete ${query === "subscribers" ? "subscriber" : "campaign"}?`,
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
