import { useEffect, useState } from "react";

import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { useRecipients } from "customHooks/useRecipients";
import Avatar from "components/Avatar";
import { contactedAgo, isRecentlyContacted, RECENT_CONTACT_DAYS } from "helpers/lastContacted";
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

interface RecipientsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// fine-tune who gets the job offer - among the candidates the role and the budget found
const RecipientsDialog = ({ isOpen, onClose }: RecipientsDialogProps) => {
  const { matching, receivers, suggested, lastContacted } = useRecipients();
  const { setChosenRecipientIds } = useGlobalStoreContext();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  // every opening starts from the people who would get the offer now
  useEffect(() => {
    if (isOpen) setChecked(new Set(receivers.map(({ id }) => id)));
    // only when it opens - not on every change of the lists behind it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const toggle = (id: string) =>
    setChecked((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const total = matching.length;
  const checkedCount = matching.filter(({ id }) => checked.has(id)).length;
  const isEveryoneChecked = total > 0 && checkedCount === total;

  // the same people the filter suggests = nothing chosen by hand
  const done = () => {
    const ids = matching.filter(({ id }) => checked.has(id)).map(({ id }) => id);
    const isSuggestion =
      ids.length === suggested.length && suggested.every(({ id }) => checked.has(id));

    setChosenRecipientIds(isSuggestion ? null : ids);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose recipients</DialogTitle>
          <DialogDescription>
            Candidates open to offers who match the role and the budget. The ones who got an
            offer in the last {RECENT_CONTACT_DAYS} days are not checked.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden rounded-lg border">
          <div className="flex items-center justify-between gap-3 border-b bg-muted/50 px-3 py-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="recipients-select-all"
                checked={isEveryoneChecked ? true : checkedCount > 0 ? "indeterminate" : false}
                onCheckedChange={() =>
                  setChecked(isEveryoneChecked ? new Set() : new Set(matching.map(({ id }) => id)))
                }
              />
              <Label htmlFor="recipients-select-all">Select all</Label>
            </div>
            <span className="text-xs text-muted-foreground" aria-live="polite">
              {checkedCount} of {total} selected
            </span>
          </div>

          <ul className="max-h-72 divide-y overflow-y-auto">
            {matching.map(({ id, fields }) => {
              const inputId = `recipient-${id}`;
              const contacted = lastContacted.get(id);

              return (
                <li key={id}>
                  <label
                    htmlFor={inputId}
                    className="flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <Checkbox
                      id={inputId}
                      checked={checked.has(id)}
                      onCheckedChange={() => toggle(id)}
                    />
                    <Avatar name={fields.name} surname={fields.surname} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {fields.name} {fields.surname}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {fields.profession || fields.email}
                        {contacted && isRecentlyContacted(contacted) && (
                          <span className="text-amber-700 dark:text-amber-300">
                            {" "}
                            · contacted {contactedAgo(contacted)}
                          </span>
                        )}
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
              ? "Choose at least one candidate"
              : "The job offer goes to the selected people."}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="brand" onClick={done}>
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecipientsDialog;
