import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleAlert, Pencil, Trash2, UserCheck } from "lucide-react";

import { formatMobileNumber, formattedData, toastMessage } from "helpers";
import { subscribersKey, useSubscribers } from "customHooks/queries";
import { useRemoveItem } from "customHooks/useRemoveItem";
import { useSubscriberPanel } from "customHooks/useSubscriberPanel";
import { createSubscriber, getErrorMessage, updateSubscriber } from "services";
import api from "services/api";
import Avatar from "components/Avatar";
import StatusBadge from "components/StatusBadge";
import { Subscriber } from "types";
import SubscriberForm from "./SubscriberForm";
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
  unsubscribed: {
    text: "Unsubscribed with the link in an e-mail - does not get campaigns any more.",
    className: "bg-muted text-muted-foreground",
  },
};

interface DetailsProps {
  subscriber: Subscriber;
  onEdit: () => void;
  onRemoved: () => void;
}

const Details = ({ subscriber, onEdit, onRemoved }: DetailsProps) => {
  const queryClient = useQueryClient();
  const { id, fields, createdTime } = subscriber;
  const fullName = `${fields.name} ${fields.surname}`;
  const { handleConfirmModalData } = useRemoveItem("subscribers", fullName, id, onRemoved);
  const notice = fields.status === "active" ? null : notices[fields.status];

  const activate = useMutation({
    mutationFn: () => api.patch(`/subscribers/${id}`, { fields: { status: "active" } }),
    // the badge and the notice change - that is the confirmation
    onSuccess: () => queryClient.invalidateQueries({ queryKey: subscribersKey }),
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
            {/* someone who left on their own is not signed up again with one click */}
            {fields.status !== "unsubscribed" && (
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
            )}
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
        <Button variant="outline" className="flex-1" onClick={onEdit}>
          <Pencil />
          Edit
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

// the list in the cache gets the saved subscriber at once (no "not found" flash),
// then it is loaded again from the server
const useSaveInList = () => {
  const queryClient = useQueryClient();

  return (saved: Subscriber) => {
    queryClient.setQueryData<Subscriber[]>(subscribersKey, (list = []) =>
      list.some(({ id }) => id === saved.id)
        ? list.map((item) => (item.id === saved.id ? saved : item))
        : [...list, saved]
    );
    queryClient.invalidateQueries({ queryKey: subscribersKey });
  };
};

// the edit form in the panel - after saving, back to the details
// (no toast: the details show the saved data at once)
const Edit = ({ subscriber, onDone }: { subscriber: Subscriber; onDone: () => void }) => {
  const { id, fields } = subscriber;
  const saveInList = useSaveInList();

  return (
    <>
      <SheetHeader className="flex-row items-center gap-3 border-b p-6">
        <Avatar name={fields.name} surname={fields.surname} className="size-10" />
        <div className="min-w-0">
          <SheetTitle className="text-xl">Edit subscriber</SheetTitle>
          <SheetDescription className="truncate">
            {fields.name} {fields.surname}
          </SheetDescription>
        </div>
      </SheetHeader>
      <SubscriberForm
        currentId={id}
        defaultValues={{
          name: fields.name ?? "",
          surname: fields.surname ?? "",
          email: fields.email ?? "",
          status: fields.status,
          profession: fields.profession ?? "",
          salary: fields.salary ?? "",
          telephone: fields.telephone ?? "",
        }}
        submitLabel="Save changes"
        onCancel={onDone}
        onSubmit={(data) =>
          updateSubscriber({
            data,
            id,
            callback: (updated) => {
              saveInList({ ...subscriber, fields: { ...subscriber.fields, ...updated } });
              onDone();
            },
          })
        }
      />
    </>
  );
};

// the subscriber panel over the list - the list keeps its search, filter and page;
// it shows the details, the edit form or the "add subscriber" form (see useSubscriberPanel)
const SubscriberDetailsPanel = () => {
  const panel = useSubscriberPanel();
  const saveInList = useSaveInList();
  const { data: subscribers, isLoading } = useSubscribers();
  const subscriber = subscribers?.find(({ id }) => id === panel.viewId);

  const content = () => {
    if (panel.mode === "new") {
      return (
        <>
          <SheetHeader className="border-b p-6">
            <SheetTitle className="text-xl">New subscriber</SheetTitle>
            <SheetDescription>Add a person to your mailing list.</SheetDescription>
          </SheetHeader>
          <SubscriberForm
            submitLabel="Add subscriber"
            onCancel={panel.close}
            onSubmit={(data) =>
              createSubscriber({
                data,
                // show the new subscriber at once
                callback: (created) => {
                  saveInList(created);
                  panel.open(created.id);
                },
              })
            }
          />
        </>
      );
    }

    if (!subscriber) {
      return (
        <SheetHeader className="p-6">
          <SheetTitle>{isLoading ? "Loading..." : "Subscriber not found"}</SheetTitle>
          <SheetDescription>
            {isLoading ? "" : "Subscriber does not exist! Maybe it has just been removed."}
          </SheetDescription>
        </SheetHeader>
      );
    }

    if (panel.mode === "edit") {
      return <Edit subscriber={subscriber} onDone={() => panel.open(subscriber.id)} />;
    }

    return (
      <Details
        subscriber={subscriber}
        onEdit={() => panel.edit(subscriber.id)}
        onRemoved={panel.close}
      />
    );
  };

  return (
    <Sheet open={panel.isOpen} onOpenChange={(isOpen) => !isOpen && panel.close()}>
      <SheetContent
        side="right"
        className="gap-0 p-0 outline-none data-[side=right]:w-full sm:data-[side=right]:max-w-md"
        // focus the panel itself - not the first button (it could be "Delete")
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (event.currentTarget as HTMLElement).focus();
        }}
      >
        {content()}
      </SheetContent>
    </Sheet>
  );
};

export default SubscriberDetailsPanel;
