import { useNavigate } from "react-router";
import { Copy, Pencil, Trash2 } from "lucide-react";

import { useRemoveItem } from "customHooks/useRemoveItem";
import RowActionsTrigger from "components/DataTable/RowActionsTrigger";
import { Campaign } from "types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDuplicateCampaign } from "./useDuplicateCampaign";

// a draft: Edit / Duplicate / Delete; a sent campaign: Duplicate / Delete
// (the "Sent" badge already says it can not be changed)
const CampaignActions = ({ campaign }: { campaign: Campaign }) => {
  const navigate = useNavigate();
  const duplicate = useDuplicateCampaign();
  const { id, fields } = campaign;
  const { handleConfirmModalData } = useRemoveItem("campaigns", fields.title, id);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <RowActionsTrigger label={`Actions for ${fields.title}`} />
        <DropdownMenuContent align="end">
          {fields.status === "draft" && (
            <DropdownMenuItem onSelect={() => navigate(`/campaigns/edit/${id}`)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => duplicate(campaign)}>
            <Copy />
            Duplicate
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

export default CampaignActions;
