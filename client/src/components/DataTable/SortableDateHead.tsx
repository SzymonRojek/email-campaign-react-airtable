import { ArrowDown, ArrowUp } from "lucide-react";

import { SortDirection } from "helpers/sortByDate";
import { TableHead } from "@/components/ui/table";

interface SortableDateHeadProps {
  direction: SortDirection;
  onToggle: () => void;
}

// "Date" column header - click to switch between newest and oldest first
const SortableDateHead = ({ direction, onToggle }: SortableDateHeadProps) => {
  const Icon = direction === "newest" ? ArrowDown : ArrowUp;

  return (
    <TableHead aria-sort={direction === "newest" ? "descending" : "ascending"}>
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-1 rounded-sm font-medium hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        title={direction === "newest" ? "Newest first" : "Oldest first"}
      >
        Date
        <Icon className="size-3.5" aria-hidden />
        <span className="sr-only">
          {direction === "newest" ? ", newest first" : ", oldest first"}
        </span>
      </button>
    </TableHead>
  );
};

export default SortableDateHead;
