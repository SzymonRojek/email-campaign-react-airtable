import { useConfirmModalState } from "contexts/ConfirmModalContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ConfirmModal = () => {
  const {
    isOpenConfirmModal,
    confirmModalText: { message, additionalText, question },
    confirmModalProps: { onConfirm, onClose },
  } = useConfirmModalState();

  return (
    <AlertDialog
      open={isOpenConfirmModal}
      onOpenChange={(isOpen) => !isOpen && onClose?.()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{message ?? question}</AlertDialogTitle>
          {additionalText && (
            <p className="font-semibold text-destructive">{additionalText}</p>
          )}
          <AlertDialogDescription>
            {message && question ? question : "This cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onClose?.()}>No</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
