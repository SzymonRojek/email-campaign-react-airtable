import { useMutation, useQueryClient } from "react-query";

import { useConfirmModalState } from "contexts/ConfirmModalContext";
import api from "../services/api";
import { toastMessage } from "helpers";

const styles = {
  questionText: { color: "crimson", fontWeight: "bold" },
};

export const useRemoveItem = (query, data, id) => {
  const queryCache = useQueryClient();

  const { setConfirmModalState, setConfirmModalText } = useConfirmModalState();

  const { mutateAsync } = useMutation((id) => api.delete(`/${query}/${id}`), {
    onMutate: async (id) => {
      await queryCache.cancelQueries(`/${query}`);

      const previousItems = queryCache.getQueryData(`/${query}`);

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

      toastMessage(`Item has not been removed: ${error.message}`);
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
