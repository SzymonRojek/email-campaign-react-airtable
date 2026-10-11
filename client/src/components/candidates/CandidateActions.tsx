import { Eye, Pencil, Trash2 } from "lucide-react";

import { useRemoveItem } from "customHooks/useRemoveItem";
import { useCandidatePanel } from "customHooks/useCandidatePanel";
import { Candidate } from "types";
import RowActionsTrigger from "components/DataTable/RowActionsTrigger";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// one "..." menu instead of three icons - the same in the table row and the phone card
const CandidateActions = ({ candidate }: { candidate: Candidate }) => {
  const { open, edit } = useCandidatePanel();
  const { id, fields } = candidate;
  const fullName = `${fields.name} ${fields.surname}`;
  const { handleConfirmModalData } = useRemoveItem("candidates", fullName, id);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <RowActionsTrigger label={`Actions for ${fullName}`} />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => open(id)}>
            <Eye />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => edit(id)}>
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={handleConfirmModalData}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CandidateActions;
