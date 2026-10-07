import { useNavigate } from "react-router";
import { Info, Pencil, Trash2 } from "lucide-react";

import { useRemoveItem } from "customHooks/useRemoveItem";
import { Subscriber } from "types";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// why there is no details page - shown on the disabled button
const noDetailsReason = (name: string, status: string) =>
  status === "pending"
    ? `${name} is pending - complete all the data to see the details.`
    : `${name} is blocked - the details are not available.`;

// edit / details / delete - the same in the table row and in the mobile card
const SubscriberActions = ({ subscriber }: { subscriber: Subscriber }) => {
  const navigate = useNavigate();
  const { id, fields } = subscriber;
  const { handleConfirmModalData } = useRemoveItem("subscribers", fields.name, id);
  const hasDetails = fields.status === "active";

  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label="edit"
        title="Edit"
        onClick={() => navigate(`/subscribers/edit/${id}`)}
      >
        <Pencil />
      </Button>
      {hasDetails ? (
        <Button
          variant="ghost"
          size="icon"
          aria-label="subscriber-details"
          title="Details"
          onClick={() => navigate(`/subscribers/details/${id}`)}
        >
          <Info />
        </Button>
      ) : (
        <Tooltip>
          {/* a disabled button gets no hover / focus - the wrapper shows the tooltip */}
          <TooltipTrigger asChild>
            <span tabIndex={0} className="inline-flex rounded-md">
              <Button
                variant="ghost"
                size="icon"
                aria-label="subscriber-details"
                disabled
                className="pointer-events-none"
              >
                <Info />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>{noDetailsReason(fields.name, fields.status)}</TooltipContent>
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

export default SubscriberActions;
