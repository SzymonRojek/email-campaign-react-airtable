import { useCallback, useEffect, useMemo, useState } from "react";

import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { useSubscribers } from "customHooks/queries";
import { Subscriber } from "types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  areSomeTruthy,
  countStateTruthy,
  handleCheckedAll,
  handleUncheckedAll,
} from "./recipientsUtilities";

interface RecipientsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// choose which active subscribers get the campaign (all of them by default)
const RecipientsDialog = ({ isOpen, onClose }: RecipientsDialogProps) => {
  const { data: subscribers } = useSubscribers("Cannot get subscribers list:");
  const { setFinalSelectedActiveSubscribers } = useGlobalStoreContext();
  const [checkedState, setCheckedState] = useState<boolean[]>([]);

  const activeSubscribers = useMemo(
    () => (subscribers ?? []).filter(({ fields }) => fields.status === "active"),
    [subscribers]
  );

  const allChecked = useCallback(
    () => new Array<boolean>(activeSubscribers.length).fill(true),
    [activeSubscribers]
  );

  useEffect(() => {
    setCheckedState(allChecked());
  }, [allChecked]);

  const updateSelection = (updatedCheckedState: boolean[]) => {
    setCheckedState(updatedCheckedState);
    setFinalSelectedActiveSubscribers(
      activeSubscribers.filter((_, index) => updatedCheckedState[index])
    );
  };

  const toggle = (position: number) =>
    updateSelection(
      checkedState.map((item, index) => (index === position ? !item : item))
    );

  // closing with X / Escape cancels the choice - back to all active subscribers
  const cancel = () => {
    setFinalSelectedActiveSubscribers(null);
    setCheckedState(allChecked());
    onClose();
  };

  const checkedCount = countStateTruthy(checkedState);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && cancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Active subscribers</DialogTitle>
          <DialogDescription>
            Choose who gets this campaign.
          </DialogDescription>
        </DialogHeader>

        {areSomeTruthy(checkedState) ? (
          <Button
            variant="outline"
            className="justify-self-start"
            onClick={() => handleUncheckedAll(updateSelection, checkedState)}
          >
            Uncheck all
          </Button>
        ) : (
          <Button
            variant="outline"
            className="justify-self-start"
            onClick={() => handleCheckedAll(updateSelection, checkedState)}
          >
            Check all
          </Button>
        )}

        <ul className="grid max-h-72 gap-3 overflow-y-auto sm:grid-cols-2">
          {activeSubscribers.map((subscriber: Subscriber, index) => {
            const id = `recipient-${subscriber.id}`;

            return (
              <li key={subscriber.id} className="flex items-center gap-2">
                <Checkbox
                  id={id}
                  checked={checkedState[index] ?? false}
                  onCheckedChange={() => toggle(index)}
                />
                <Label htmlFor={id} className="font-normal">
                  {subscriber.fields.name} {subscriber.fields.surname}
                </Label>
              </li>
            );
          })}
        </ul>

        <DialogFooter className="items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {checkedCount === 0
              ? "Please choose subscribers"
              : `Checked subscribers: ${checkedCount}`}
          </p>
          <Button variant="brand" onClick={onClose}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipientsDialog;
