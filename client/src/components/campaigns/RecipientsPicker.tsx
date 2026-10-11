import { useState } from "react";
import { Users } from "lucide-react";

import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { useRecipients } from "customHooks/useRecipients";
import { pluralize } from "helpers";
import { RECENT_CONTACT_DAYS } from "helpers/lastContacted";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RecipientsDialog from "./RecipientsDialog";

const ALL_ROLES = "all";

// "To:" of a job offer - the role and the budget find the candidates, the ones contacted
// lately are skipped, and the dialog fine-tunes the list by hand
const RecipientsPicker = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { recipientFilter: filter, updateRecipientFilter } = useGlobalStoreContext();
  const { roles, matching, recent, hasNoActiveSubscribers, isChosenByHand, label } =
    useRecipients();

  return (
    <section
      aria-labelledby="recipients-heading"
      className="grid gap-3 rounded-lg bg-muted px-4 py-3"
    >
      <h2 id="recipients-heading" className="text-sm font-medium">
        Recipients
      </h2>

      <div className="flex flex-wrap items-end gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="recipient-role" className="text-xs text-muted-foreground">
            Role
          </Label>
          <Select
            value={filter.role || ALL_ROLES}
            onValueChange={(role) => updateRecipientFilter({ role: role === ALL_ROLES ? "" : role })}
            disabled={hasNoActiveSubscribers}
          >
            <SelectTrigger id="recipient-role" className="w-52 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_ROLES}>All roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="recipient-budget" className="text-xs text-muted-foreground">
            Budget per month
          </Label>
          <Input
            id="recipient-budget"
            inputMode="numeric"
            placeholder="any"
            className="w-32 bg-background"
            value={filter.maxSalary}
            disabled={hasNoActiveSubscribers}
            // digits only - it is compared with the expected salary
            onChange={(event) =>
              updateRecipientFilter({ maxSalary: event.target.value.replace(/\D/g, "") })
            }
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="sm:ml-auto"
          disabled={matching.length === 0}
          onClick={() => setIsDialogOpen(true)}
        >
          <Users />
          Choose recipients
        </Button>
      </div>

      {recent.length > 0 && !isChosenByHand && (
        <div className="flex items-center gap-2">
          <Checkbox
            id="skip-recent"
            checked={filter.skipRecent}
            onCheckedChange={(checked) => updateRecipientFilter({ skipRecent: checked === true })}
          />
          <Label htmlFor="skip-recent" className="font-normal">
            Skip {pluralize(recent.length, "candidate")} contacted in the last{" "}
            {RECENT_CONTACT_DAYS} days
          </Label>
        </div>
      )}

      <p className="text-sm font-medium" aria-live="polite">
        {label}
      </p>

      <RecipientsDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </section>
  );
};

export default RecipientsPicker;
