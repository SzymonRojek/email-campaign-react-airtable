import { useNavigate } from "react-router";
import { Copy, Mail, Pencil, Trash2 } from "lucide-react";

import { useRemoveItem } from "customHooks/useRemoveItem";
import RowActionsTrigger from "components/DataTable/RowActionsTrigger";
import { JobOffer } from "types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDuplicateJobOffer } from "./useDuplicateJobOffer";

// a draft: Edit / Duplicate / Delete; a sent job offer: View recipients / Duplicate / Delete
// (the "Sent" badge already says it can not be changed)
const JobOfferActions = ({ jobOffer }: { jobOffer: JobOffer }) => {
  const navigate = useNavigate();
  const duplicate = useDuplicateJobOffer();
  const { id, fields } = jobOffer;
  const { handleConfirmModalData } = useRemoveItem("job-offers", fields.subject, id);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <RowActionsTrigger label={`Actions for ${fields.subject}`} />
        <DropdownMenuContent align="end">
          {fields.status === "draft" ? (
            <DropdownMenuItem onSelect={() => navigate(`/job-offers/edit/${id}`)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => navigate(`/job-offers/${id}`)}>
              <Mail />
              View recipients
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => duplicate(jobOffer)}>
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

export default JobOfferActions;
