import { useMutation, useQueryClient } from "react-query";

import { useConfirmModalState } from "contexts/ConfirmModalContext";
import api from "../services/api";
import getErrorMessage from "../services/getErrorMessage";
import { toastMessage } from "helpers";
import { AirtableRecord } from "types";

const styles = {
  questionText: { color: "crimson", fontWeight: "bold" },
} as const;

type Item = AirtableRecord<unknown>;

export const useRemoveItem = (
  query: "subscribers" | "campaigns",
  data: string | undefined,
  id: string
) => {
  const queryCache = useQueryClient();

  const { setConfirmModalState, setConfirmModalText } = useConfirmModalState();

  const { mutateAsync } = useMutation<
    unknown,
    unknown,
    string,
    { previousItems?: Item[] }
  >((id) => api.delete(`/${query}/${id}`), {
    onMutate: async (id) => {
      await queryCache.cancelQueries(`/${query}`);

      const previousItems = queryCache.getQueryData<Item[]>(`/${query}`);

      if (previousItems) {
        queryCache.setQueryData(
          `/${query}`,
          previousItems.filter((item) => item.id !== id)
        );
      }

      return { previousItems };
    },
    onError: (error, id, context) => {
      if (context?.previousItems) {
        queryCache.setQueryData(`/${query}`, context.previousItems);
      }

      toastMessage(`Item has not been removed: ${getErrorMessage(error)}`);
    },
    onSettled: () => queryCache.invalidateQueries(`/${query}`),
  });

  const confirmModalProps = {
    onConfirm: () => mutateAsync(id),
    onClose: () => setConfirmModalState({ isOpenConfirmModal: false }),
  };

  const handleConfirmModalData = () => {
    setConfirmModalState({
      confirmModalProps,
      isOpenConfirmModal: true,
    });
    setConfirmModalText({
      question: (
        <>
          Are you sure you want to remove{" "}
          <span style={styles.questionText}>{data}</span>?
        </>
      ),
    });
  };

  return { handleConfirmModalData };
};
