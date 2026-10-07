import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// the "..." button of a list row - the tooltip says what it is for
const RowActionsTrigger = ({ label }: { label: string }) => (
  <Tooltip delayDuration={300}>
    <TooltipTrigger asChild>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
    </TooltipTrigger>
    <TooltipContent>More actions</TooltipContent>
  </Tooltip>
);

export default RowActionsTrigger;
