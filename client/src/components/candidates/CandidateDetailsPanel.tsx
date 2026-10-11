import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, CircleAlert, Pencil, Trash2, UserCheck } from "lucide-react";

import { formatMobileNumber, formatSalary, formattedData, toastMessage } from "helpers";
import { candidatesKey, useCandidateEmails, useCandidates } from "customHooks/queries";
import { useRemoveItem } from "customHooks/useRemoveItem";
import { useCandidatePanel } from "customHooks/useCandidatePanel";
import { createCandidate, getErrorMessage, updateCandidate } from "services";
import api from "services/api";
import Avatar from "components/Avatar";
import StatusBadge from "components/StatusBadge";
import { Candidate } from "types";
import CandidateForm from "./CandidateForm";
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
  "awaiting consent": {
    text: "Awaiting consent - the candidate gets no job offers until they agree to them.",
    className: "bg-amber-500/10 text-amber-800 dark:text-amber-200",
  },
  "do not contact": {
    text: "Do not contact - this candidate gets no job offers.",
    className: "bg-red-500/10 text-red-800 dark:text-red-200",
  },
  "opted out": {
    text: "Opted out with the link in an e-mail - gets no job offers any more.",
    className: "bg-muted text-muted-foreground",
  },
};

// the job offers the candidate got - each one opens the e-mail itself
const ReceivedJobOffers = ({ candidateId }: { candidateId: string }) => {
  const { data: emails, isLoading, isError } = useCandidateEmails(candidateId);

  return (
    <section aria-labelledby="received-heading" className="grid gap-2">
      <h3
        id="received-heading"
        className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
      >
        Job offers received
      </h3>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">The job offers could not be loaded.</p>
      ) : !emails?.length ? (
        <p className="text-sm text-muted-foreground">No job offers yet.</p>
      ) : (
        <ul aria-label="Job offers received" className="-mx-2 grid">
          {emails.map(({ id, jobOfferId, subject, sentAt }) => (
            <li key={id}>
              <Link
                to={`/job-offers/${jobOfferId}?email=${id}`}
                className="flex items-center justify-between gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{subject}</span>
                  <span className="block text-xs text-muted-foreground">
                    {formattedData.getFormattedDateTime(sentAt)}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

interface DetailsProps {
  candidate: Candidate;
  onEdit: () => void;
  onRemoved: () => void;
}

const Details = ({ candidate, onEdit, onRemoved }: DetailsProps) => {
  const queryClient = useQueryClient();
  const { id, fields, createdTime } = candidate;
  const fullName = `${fields.name} ${fields.surname}`;
  const { handleConfirmModalData } = useRemoveItem("candidates", fullName, id, onRemoved);
  const notice = fields.status === "open to offers" ? null : notices[fields.status];

  const activate = useMutation({
    mutationFn: () => api.patch(`/candidates/${id}`, { fields: { status: "open to offers" } }),
    // the badge and the notice change - that is the confirmation
    onSuccess: () => queryClient.invalidateQueries({ queryKey: candidatesKey }),
    onError: (error) => toastMessage(`The status has not been changed: ${getErrorMessage(error)}`),
  });

  const details = [
    { label: "Role", value: fields.role },
    { label: "Expected salary", value: formatSalary(fields.expectedSalary) },
    {
      label: "Phone",
      value: fields.phone && `+44 ${formatMobileNumber(fields.phone)}`,
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
            {fields.status !== "opted out" && (
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

        <ReceivedJobOffers candidateId={id} />
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

// the list in the cache gets the saved candidate at once (no "not found" flash),
// then it is loaded again from the server
const useSaveInList = () => {
  const queryClient = useQueryClient();

  return (saved: Candidate) => {
    queryClient.setQueryData<Candidate[]>(candidatesKey, (list = []) =>
      list.some(({ id }) => id === saved.id)
        ? list.map((item) => (item.id === saved.id ? saved : item))
        : [...list, saved]
    );
    queryClient.invalidateQueries({ queryKey: candidatesKey });
  };
};

// the edit form in the panel - after saving, back to the details
// (no toast: the details show the saved data at once)
const Edit = ({ candidate, onDone }: { candidate: Candidate; onDone: () => void }) => {
  const { id, fields } = candidate;
  const saveInList = useSaveInList();

  return (
    <>
      <SheetHeader className="flex-row items-center gap-3 border-b p-6">
        <Avatar name={fields.name} surname={fields.surname} className="size-10" />
        <div className="min-w-0">
          <SheetTitle className="text-xl">Edit candidate</SheetTitle>
          <SheetDescription className="truncate">
            {fields.name} {fields.surname}
          </SheetDescription>
        </div>
      </SheetHeader>
      <CandidateForm
        currentId={id}
        defaultValues={{
          name: fields.name ?? "",
          surname: fields.surname ?? "",
          email: fields.email ?? "",
          status: fields.status,
          role: fields.role ?? "",
          expectedSalary: fields.expectedSalary ?? "",
          phone: fields.phone ?? "",
        }}
        submitLabel="Save changes"
        onCancel={onDone}
        onSubmit={(data) =>
          updateCandidate({
            data,
            id,
            callback: (updated) => {
              saveInList({ ...candidate, fields: { ...candidate.fields, ...updated } });
              onDone();
            },
          })
        }
      />
    </>
  );
};

// the candidate panel over the list - the list keeps its search, filter and page;
// it shows the details, the edit form or the "add candidate" form (see useCandidatePanel)
const CandidateDetailsPanel = () => {
  const panel = useCandidatePanel();
  const saveInList = useSaveInList();
  const { data: candidates, isLoading } = useCandidates();
  const candidate = candidates?.find(({ id }) => id === panel.viewId);

  const content = () => {
    if (panel.mode === "new") {
      return (
        <>
          <SheetHeader className="border-b p-6">
            <SheetTitle className="text-xl">New candidate</SheetTitle>
            <SheetDescription>Add a person to your talent pool.</SheetDescription>
          </SheetHeader>
          <CandidateForm
            submitLabel="Add candidate"
            onCancel={panel.close}
            onSubmit={(data) =>
              createCandidate({
                data,
                // show the new candidate at once
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

    if (!candidate) {
      return (
        <SheetHeader className="p-6">
          <SheetTitle>{isLoading ? "Loading..." : "Candidate not found"}</SheetTitle>
          <SheetDescription>
            {isLoading ? "" : "Candidate does not exist! Maybe they have just been removed."}
          </SheetDescription>
        </SheetHeader>
      );
    }

    if (panel.mode === "edit") {
      return <Edit candidate={candidate} onDone={() => panel.open(candidate.id)} />;
    }

    return (
      <Details
        candidate={candidate}
        onEdit={() => panel.edit(candidate.id)}
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

export default CandidateDetailsPanel;
