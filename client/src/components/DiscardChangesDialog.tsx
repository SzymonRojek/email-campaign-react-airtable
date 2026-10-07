import { useRef } from "react";
import type { Blocker } from "react-router";

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

// shown by useLeaveGuard when leaving a form with unsaved changes
interface DiscardChangesDialogProps {
  blocker: Blocker;
  // from useLeaveGuard
  onDiscard: () => void;
  // "Keep editing" - back to the field the user was in
  onKeepEditing: () => void;
}

const DiscardChangesDialog = ({
  blocker,
  onDiscard,
  onKeepEditing,
}: DiscardChangesDialogProps) => {
  const isDiscarding = useRef(false);

  return (
    <AlertDialog
      open={blocker.state === "blocked"}
      onOpenChange={(isOpen) => !isOpen && blocker.reset?.()}
    >
      <AlertDialogContent
        // "Keep editing" or Esc: not to the page, back into the form
        onCloseAutoFocus={(event) => {
          if (isDiscarding.current) {
            isDiscarding.current = false;
            return;
          }
          event.preventDefault();
          onKeepEditing();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Discard changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. If you leave now, they will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => blocker.reset?.()}>
            Keep editing
          </AlertDialogCancel>
          <AlertDialogAction
            variant="danger"
            onClick={() => {
              isDiscarding.current = true;
              onDiscard();
            }}
          >
            Discard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DiscardChangesDialog;
