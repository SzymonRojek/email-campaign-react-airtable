import { useNavigate } from "react-router";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { useRemoveItem } from "customHooks/useRemoveItem";
import { Campaign } from "types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// the same "..." menu as the subscribers - only a draft can be edited
const CampaignActions = ({ campaign }: { campaign: Campaign }) => {
  const navigate = useNavigate();
  const { id, fields } = campaign;
  const { handleConfirmModalData } = useRemoveItem("campaigns", fields.title, id);
  const isDraft = fields.status === "draft";

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={`Actions for ${fields.title}`}>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={!isDraft}
            onSelect={() => navigate(`/campaigns/edit/${id}`)}
          >
            <Pencil />
            Edit draft
          </DropdownMenuItem>
          {!isDraft && (
            <DropdownMenuLabel>Sent - a campaign can not be changed.</DropdownMenuLabel>
          )}
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

export default CampaignActions;
