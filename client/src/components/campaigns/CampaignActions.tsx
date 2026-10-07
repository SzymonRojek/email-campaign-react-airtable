import { useNavigate } from "react-router";
import { Pencil, PencilOff, Trash2 } from "lucide-react";

import { useRemoveItem } from "customHooks/useRemoveItem";
import { Campaign } from "types";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// edit / delete - the same in the table row and in the mobile card
const CampaignActions = ({ campaign }: { campaign: Campaign }) => {
  const navigate = useNavigate();
  const { id, fields } = campaign;
  const { handleConfirmModalData } = useRemoveItem("campaigns", fields.title, id);

  return (
    <div className="flex justify-end gap-1">
      {fields.status === "draft" ? (
        <Button
          variant="ghost"
          size="icon"
          aria-label="edit"
          title="Edit draft"
          onClick={() => navigate(`/campaigns/edit/${id}`)}
        >
          <Pencil />
        </Button>
      ) : (
        <Tooltip>
          {/* a disabled button gets no hover / focus - the wrapper shows the tooltip */}
          <TooltipTrigger asChild>
            <span tabIndex={0} className="inline-flex rounded-md">
              <Button
                variant="ghost"
                size="icon"
                aria-label="edit off"
                disabled
                className="pointer-events-none"
              >
                <PencilOff />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>Already sent - a sent campaign can not be changed.</TooltipContent>
        </Tooltip>
      )}
      <Button
        variant="ghost"
        size="icon"
        aria-label="delete"
        title="Delete"
        className="text-destructive hover:text-destructive"
        onClick={handleConfirmModalData}
      >
        <Trash2 />
      </Button>
    </div>
  );
};

export default CampaignActions;
