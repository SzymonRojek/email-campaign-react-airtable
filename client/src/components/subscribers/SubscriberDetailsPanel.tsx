import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleAlert, Pencil, Trash2, UserCheck } from "lucide-react";

import { formatMobileNumber, formattedData, toastMessage, toastSuccess } from "helpers";
import { subscribersKey, useSubscribers } from "customHooks/queries";
import { useRemoveItem } from "customHooks/useRemoveItem";
import { useSubscriberPanel } from "customHooks/useSubscriberPanel";
import { getErrorMessage } from "services";
import api from "services/api";
import Avatar from "components/Avatar";
import StatusBadge from "components/StatusBadge";
import { Subscriber } from "types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const notices = {
  pending: {
    text: "Waiting for a confirmation - a pending subscriber does not get campaigns yet.",
    className: "bg-amber-500/10 text-amber-800 dark:text-amber-200",
  },
  blocked: {
    text: "Blocked - this subscriber does not get any campaigns.",
    className: "bg-red-500/10 text-red-800 dark:text-red-200",
  },
};

const Details = ({ subscriber, onRemoved }: { subscriber: Subscriber; onRemoved: () => void }) => {
  const queryClient = useQueryClient();
  const { id, fields, createdTime } = subscriber;
  const fullName = `${fields.name} ${fields.surname}`;
  const { handleConfirmModalData } = useRemoveItem("subscribers", fullName, id, onRemoved);
  const notice = fields.status === "active" ? null : notices[fields.status];

  const activate = useMutation({
    mutationFn: () => api.patch(`/subscribers/${id}`, { fields: { status: "active" } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: subscribersKey });
      toastSuccess(`${fullName} is active now`);
    },
    onError: (error) => toastMessage(`The status has not been changed: ${getErrorMessage(error)}`),
  });

  const details = [
    { label: "Profession", value: fields.profession },
    { label: "Salary", value: fields.salary },
    {
      label: "Telephone",
      value: fields.telephone && `+44 ${formatMobileNumber(fields.telephone)}`,
    },
    { label: "Added", value: formattedData.getFormattedDateTime(fields.date || createdTime) },
  ];

  return (
    <>
      <SheetHeader className="gap-3 border-b p-6">
        <Avatar name={fields.name} surname={fields.surname} className="size-12 text-base" />
        <div className="min-w-0">
          <SheetTitle className="text-xl">{fullName}</SheetTitle>
          <SheetDescription className="truncate">{fields.email}</SheetDescription>
        </div>
        <div>
          <StatusBadge status={fields.status} />
        </div>
      </SheetHeader>

      <div className="grid gap-6 overflow-y-auto p-6">
        {notice && (
          <div className={cn("grid gap-3 rounded-lg p-3 text-sm", notice.className)}>
            <p className="flex gap-2">
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              {notice.text}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="justify-self-start"
              disabled={activate.isPending}
              onClick={() => activate.mutate()}
            >
              <UserCheck />
              {activate.isPending ? "Activating..." : "Activate"}
            </Button>
          </div>
        )}

        <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
          {details.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {label}
              </dt>
              <dd className="mt-1 font-medium break-words">{value || "-"}</dd>
            </div>
          ))}
        </dl>
      </div>

      <SheetFooter className="flex-row border-t">
        <Button asChild variant="outline" className="flex-1">
          <Link to={`/subscribers/edit/${id}`}>
            <Pencil />
            Edit
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleConfirmModalData}
        >
          <Trash2 />
          Delete
        </Button>
      </SheetFooter>
    </>
  );
};

// the details of one subscriber over the list - the list keeps its search, filter and page
const SubscriberDetailsPanel = () => {
  const { viewId, close } = useSubscriberPanel();
  const { data: subscribers, isLoading } = useSubscribers();
  const subscriber = subscribers?.find(({ id }) => id === viewId);

  return (
    <Sheet open={Boolean(viewId)} onOpenChange={(isOpen) => !isOpen && close()}>
      <SheetContent
        side="right"
        className="gap-0 p-0 data-[side=right]:w-full sm:data-[side=right]:max-w-md"
        // focus the panel itself - not the first button (it could be "Delete")
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (event.currentTarget as HTMLElement).focus();
        }}
      >
        {subscriber ? (
          <Details subscriber={subscriber} onRemoved={close} />
        ) : (
          <SheetHeader className="p-6">
            <SheetTitle>{isLoading ? "Loading..." : "Subscriber not found"}</SheetTitle>
            <SheetDescription>
              {isLoading ? "" : "Subscriber does not exist! Maybe it has just been removed."}
            </SheetDescription>
          </SheetHeader>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SubscriberDetailsPanel;
