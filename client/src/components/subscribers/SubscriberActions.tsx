import { useNavigate } from "react-router";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { useRemoveItem } from "customHooks/useRemoveItem";
import { useSubscriberPanel } from "customHooks/useSubscriberPanel";
import { Subscriber } from "types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// one "..." menu instead of three icons - the same in the table row and the phone card
const SubscriberActions = ({ subscriber }: { subscriber: Subscriber }) => {
  const navigate = useNavigate();
  const { open } = useSubscriberPanel();
  const { id, fields } = subscriber;
  const fullName = `${fields.name} ${fields.surname}`;
  const { handleConfirmModalData } = useRemoveItem("subscribers", fullName, id);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`Actions for ${fullName}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => open(id)}>
            <Eye />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigate(`/subscribers/edit/${id}`)}>
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

export default SubscriberActions;
