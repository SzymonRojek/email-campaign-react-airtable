import { useNavigate } from "react-router";
import { Info, Pencil, Trash2 } from "lucide-react";

import { formattedData } from "helpers";
import { useRemoveItem } from "customHooks/useRemoveItem";
import { useInformationModalState } from "contexts/InformationModalContext";
import StatusBadge from "components/StatusBadge";
import { Subscriber } from "types";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

interface SubscriberRowProps {
  subscriber: Subscriber;
  number: number;
  withActions: boolean;
}

const SubscriberRow = ({ subscriber, number, withActions }: SubscriberRowProps) => {
  const navigate = useNavigate();
  const { id, fields, createdTime } = subscriber;
  const date = fields.date || createdTime;

  const { handleConfirmModalData } = useRemoveItem("subscribers", fields.name, id);
  const { setInformationModalState, setInformationModalText } =
    useInformationModalState();

  // only active subscribers have their details page
  const showDetails = () => {
    if (fields.status === "active") {
      navigate(`/subscribers/details/${id}`);
      return;
    }

    setInformationModalText(
      fields.status === "pending"
        ? {
            title: "Please wait...",
            message: `${fields.name}'s status is pending at the moment because you need to complete all data in the table.`,
          }
        : {
            title: "Unfortunately...",
            message: `${fields.name}'s status is blocked - can not get an access to more details.`,
          }
    );
    setInformationModalState({
      isOpenInformationModal: true,
      informationModalProps: {
        colorButton: fields.status === "blocked" ? "error" : "success",
        onClose: () => setInformationModalState({ isOpenInformationModal: false }),
      },
    });
  };

  return (
    <TableRow>
      <TableCell className="w-10 text-muted-foreground">{number}</TableCell>
      <TableCell className="font-medium">{fields.name}</TableCell>
      <TableCell>{fields.surname}</TableCell>
      <TableCell>
        <StatusBadge status={fields.status} />
      </TableCell>
      <TableCell>{formattedData.getFormattedDate(date)}</TableCell>
      <TableCell>{formattedData.getFormattedTime(date)}</TableCell>
      {withActions && (
        <TableCell>
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
            <Button
              variant="ghost"
              size="icon"
              aria-label="subscriber-details"
              title="Details"
              onClick={showDetails}
            >
              <Info />
            </Button>
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
      )}
    </TableRow>
  );
};

export default SubscriberRow;
