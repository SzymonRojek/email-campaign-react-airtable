import { Trash2 } from "lucide-react";

import { useConfirmModalState } from "contexts/ConfirmModalContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// asks before an action that can not be undone (removing a subscriber / campaign)
const ConfirmModal = () => {
  const {
    isOpenConfirmModal,
    confirmModalText: { title, description, confirmLabel = "Delete" },
    confirmModalProps: { onConfirm, onClose },
  } = useConfirmModalState();

  return (
    <AlertDialog
      open={isOpenConfirmModal}
      onOpenChange={(isOpen) => !isOpen && onClose?.()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="rounded-full bg-destructive/10 text-destructive">
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onClose?.()}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="danger"
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
