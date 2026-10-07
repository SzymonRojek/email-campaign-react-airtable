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
}

const DiscardChangesDialog = ({ blocker, onDiscard }: DiscardChangesDialogProps) => (
  <AlertDialog
    open={blocker.state === "blocked"}
    onOpenChange={(isOpen) => !isOpen && blocker.reset?.()}
  >
    <AlertDialogContent>
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
        <AlertDialogAction variant="danger" onClick={onDiscard}>
          Discard
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default DiscardChangesDialog;
