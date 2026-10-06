import { useNavigate } from "react-router";
import { Pencil, PencilOff, Trash2 } from "lucide-react";

import { formattedData } from "helpers";
import { useRemoveItem } from "customHooks/useRemoveItem";
import StatusBadge from "components/StatusBadge";
import { Campaign } from "types";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface CampaignRowProps {
  campaign: Campaign;
  number: number;
}

const CampaignRow = ({ campaign, number }: CampaignRowProps) => {
  const navigate = useNavigate();
  const { id, fields, createdTime } = campaign;
  const date = fields.date || createdTime;
  const isDraft = fields.status === "draft";

  const { handleConfirmModalData } = useRemoveItem("campaigns", fields.title, id);

  return (
    <TableRow>
      <TableCell className="w-10 text-muted-foreground">{number}</TableCell>
      <TableCell className="font-medium">{fields.title}</TableCell>
      <TableCell className="max-w-xs whitespace-normal text-muted-foreground">
        {fields.description}
      </TableCell>
      <TableCell>{formattedData.getFormattedDate(date)}</TableCell>
      <TableCell>{formattedData.getFormattedTime(date)}</TableCell>
      <TableCell>
        <StatusBadge status={fields.status} />
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-1">
          {isDraft ? (
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
            // a sent campaign can not be changed any more
            <Button
              variant="ghost"
              size="icon"
              aria-label="edit off"
              title="Already sent"
              disabled
            >
              <PencilOff />
            </Button>
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
      </TableCell>
    </TableRow>
  );
};

export default CampaignRow;
