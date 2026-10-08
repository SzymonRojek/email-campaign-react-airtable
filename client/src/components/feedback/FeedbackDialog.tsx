import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FeedbackForm from "./FeedbackForm";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// the same on the login page and on the feedback page
const FeedbackDialog = ({ isOpen, onClose }: FeedbackDialogProps) => (
  <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Leave feedback</DialogTitle>
        <DialogDescription>
          Reviewing this project? I would love to know what you think. Your name, role and
          feedback appear in the app after a review.
        </DialogDescription>
      </DialogHeader>
      {/* a new form every time the dialog opens */}
      {isOpen && <FeedbackForm onClose={onClose} />}
    </DialogContent>
  </Dialog>
);

export default FeedbackDialog;
