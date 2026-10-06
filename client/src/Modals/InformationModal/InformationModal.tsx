import { useInformationModalState } from "contexts/InformationModalContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const InformationModal = () => {
  const {
    isOpenInformationModal,
    informationModalText: { title, additionalText, message },
    informationModalProps: { colorButton, onClose },
  } = useInformationModalState();

  return (
    <Dialog
      open={isOpenInformationModal}
      onOpenChange={(isOpen) => !isOpen && onClose?.()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            className={cn(
              "text-xl",
              colorButton === "error" ? "text-destructive" : "text-primary"
            )}
          >
            {title}
          </DialogTitle>
          {additionalText && (
            <p className="font-medium text-muted-foreground">{additionalText}</p>
          )}
          <DialogDescription className="text-base text-foreground">
            {message}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InformationModal;
