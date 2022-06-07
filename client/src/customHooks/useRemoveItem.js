import { useMutation, useQueryClient } from "react-query";

import api from "api";
import { useConfirmModalState } from "contexts/ConfirmModalContext";
import { capitalizeFirstLetter } from "helpers";

const styles = {
  questionText: { color: "crimson", fontWeight: "bold" },
};

export const useRemoveItem = (query, data, id) => {
  const queryCache = useQueryClient();

  const { setConfirmModalState, setConfirmModalText } = useConfirmModalState();

  const { mutateAsync } = useMutation(
    (id) => {
      api.delete(`${query}/${id}`);
    },
    {
      onMutate: (id) => {
        const previousItems = queryCache.getQueryData(`${query}`);

        const filteredItems = previousItems.filter((item) => item.id !== id);

        queryCache.setQueryData(`${query}`, filteredItems);
      },
    }
  );

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
          <span style={styles.questionText}>{capitalizeFirstLetter(data)}</span>
          ?
        </>
      ),
    });
  };

  return { handleConfirmModalData };
};
