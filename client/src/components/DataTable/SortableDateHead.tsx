import { ArrowDown, ArrowUp } from "lucide-react";

import { SortDirection } from "helpers/sortByDate";
import { Button } from "@/components/ui/button";
import { TableHead } from "@/components/ui/table";

interface SortProps {
  direction: SortDirection;
  onToggle: () => void;
}

const label = (direction: SortDirection) =>
  direction === "newest" ? "Newest first" : "Oldest first";

const DirectionIcon = ({ direction }: { direction: SortDirection }) => {
  const Icon = direction === "newest" ? ArrowDown : ArrowUp;

  return <Icon className="size-3.5" aria-hidden />;
};

// "Date" column header - click to switch between newest and oldest first
const SortableDateHead = ({ direction, onToggle }: SortProps) => (
  <TableHead aria-sort={direction === "newest" ? "descending" : "ascending"}>
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-1 rounded-sm font-medium hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      title={label(direction)}
    >
      Date
      <DirectionIcon direction={direction} />
      <span className="sr-only">, {label(direction).toLowerCase()}</span>
    </button>
  </TableHead>
);

// the same switch where there is no table header (the cards on a phone)
export const SortDirectionButton = ({
  direction,
  onToggle,
  className,
}: SortProps & { className?: string }) => (
  <Button variant="outline" size="sm" onClick={onToggle} className={className}>
    <DirectionIcon direction={direction} />
    {label(direction)}
  </Button>
);

export default SortableDateHead;
