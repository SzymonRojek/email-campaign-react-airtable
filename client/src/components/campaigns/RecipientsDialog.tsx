import { useCallback, useEffect, useMemo, useState } from "react";

import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { useSubscribers } from "customHooks/queries";
import Avatar from "components/Avatar";
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

  // Cancel / X / Escape drop the choice - back to all active subscribers
  const cancel = () => {
    setFinalSelectedActiveSubscribers(null);
    setCheckedState(allChecked());
    onClose();
  };

  const checkedCount = countStateTruthy(checkedState);
  const total = activeSubscribers.length;
  const isEveryoneChecked = total > 0 && checkedCount === total;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && cancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose recipients</DialogTitle>
          <DialogDescription>
            Only active subscribers can get a campaign.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-lg border">
          <div className="flex items-center justify-between gap-3 border-b bg-muted/50 px-3 py-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="recipients-select-all"
                checked={
                  isEveryoneChecked
                    ? true
                    : areSomeTruthy(checkedState)
                      ? "indeterminate"
                      : false
                }
                onCheckedChange={() =>
                  isEveryoneChecked
                    ? handleUncheckedAll(updateSelection, checkedState)
                    : handleCheckedAll(updateSelection, checkedState)
                }
              />
              <Label htmlFor="recipients-select-all">Select all</Label>
            </div>
            <span className="text-xs text-muted-foreground" aria-live="polite">
              {checkedCount} of {total} selected
            </span>
          </div>

          <ul className="max-h-72 divide-y overflow-y-auto">
            {activeSubscribers.map((subscriber: Subscriber, index) => {
              const id = `recipient-${subscriber.id}`;
              const { name, surname, email } = subscriber.fields;

              return (
                <li key={subscriber.id}>
                  <label
                    htmlFor={id}
                    className="flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <Checkbox
                      id={id}
                      checked={checkedState[index] ?? false}
                      onCheckedChange={() => toggle(index)}
                    />
                    <Avatar name={name} surname={surname} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {name} {surname}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {email}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <DialogFooter className="items-center gap-2 sm:justify-between">
          <p
            className={
              checkedCount === 0 ? "text-sm text-destructive" : "text-sm text-muted-foreground"
            }
          >
            {checkedCount === 0
              ? "Choose at least one subscriber"
              : "The campaign goes to the selected people."}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={cancel}>
              Cancel
            </Button>
            <Button variant="brand" onClick={onClose}>
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipientsDialog;
