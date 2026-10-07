import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ALL_STATUSES = "all";

interface StatusFilterProps<Status extends string> {
  statuses: Status[];
  value: Status | typeof ALL_STATUSES;
  onChange: (value: Status | typeof ALL_STATUSES) => void;
}

// the status filter above a list - "all" or one status
const StatusFilter = <Status extends string>({
  statuses,
  value,
  onChange,
}: StatusFilterProps<Status>) => (
  <div className="flex items-center gap-2">
    <Label htmlFor="status-filter">Status</Label>
    <Select
      value={value}
      onValueChange={(next) => onChange(next as Status | typeof ALL_STATUSES)}
    >
      <SelectTrigger id="status-filter" className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[ALL_STATUSES, ...statuses].map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default StatusFilter;
