import { ChangeEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CircleCheck, CircleX, Download, FileUp } from "lucide-react";

import { normalizeText, pluralize, toastMessage, toastSuccess } from "helpers";
import { downloadCsv, parseCsv } from "helpers/csv";
import { subscribersKey, useSubscribers } from "customHooks/queries";
import { getErrorMessage, importSubscribers } from "services";
import { trackEvent } from "../../analytics";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PUBLIC_DEMO_NOTICE } from "./publicDemoNotice";
import {
  IMPORT_COLUMNS,
  ImportRow,
  ImportStatus,
  MAX_IMPORT_ROWS,
  readSubscribersCsv,
  templateCsv,
} from "./subscribersCsv";

const statusChoices: { value: ImportStatus; label: string; hint: string }[] = [
  { value: "pending", label: "Pending", hint: "they get no campaigns until you activate them" },
  { value: "active", label: "Active", hint: "they get the next campaign" },
];

interface ImportSubscribersDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

// CSV -> preview with the result of every row -> only the valid rows are saved
const ImportSubscribersDialog = ({ isOpen, onOpenChange }: ImportSubscribersDialogProps) => {
  const queryClient = useQueryClient();
  const { data: subscribers } = useSubscribers();
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [fileError, setFileError] = useState("");
  const [ignoresStatus, setIgnoresStatus] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus>("pending");
  // active subscribers get e-mails - only with their permission
  const [hasPermission, setHasPermission] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const ready = rows.filter(({ errors }) => errors.length === 0);
  const withErrors = rows.length - ready.length;
  const canImport =
    ready.length > 0 && !isImporting && (importStatus === "pending" || hasPermission);

  const reset = () => {
    setFileName("");
    setRows([]);
    setFileError("");
    setIgnoresStatus(false);
  };

  const close = (open: boolean) => {
    if (!open) {
      reset();
      setImportStatus("pending");
      setHasPermission(false);
    }
    onOpenChange(open);
  };

  const readFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // the same file can be chosen again after a fix
    event.target.value = "";
    if (!file) return;

    reset();
    setFileName(file.name);

    const existing = new Set((subscribers ?? []).map(({ fields }) => normalizeText(fields.email)));
    const result = readSubscribersCsv(parseCsv(await file.text()), existing);

    if (result.error) setFileError(result.error);
    else {
      setRows(result.rows);
      setIgnoresStatus(result.ignoresStatus);
    }
  };

  const save = async () => {
    setIsImporting(true);

    try {
      const { created, skipped } = await importSubscribers(
        ready.map(({ fields }) => fields),
        importStatus
      );

      trackEvent("subscribers-imported");
      toastSuccess(
        `${pluralize(created, "subscriber")} imported` +
          (skipped.length ? ` - ${skipped.length} skipped (${skipped[0].reason})` : "")
      );
      await queryClient.invalidateQueries({ queryKey: subscribersKey });
      close(false);
    } catch (error) {
      toastMessage(`The subscribers have not been imported: ${getErrorMessage(error)}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import subscribers</DialogTitle>
          <DialogDescription>
            A CSV file with the columns {IMPORT_COLUMNS.join(", ")} - name, surname and
            e-mail are required, at most {MAX_IMPORT_ROWS} rows.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-3">
          <label
            className={cn(
              "flex flex-1 cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-3 text-sm transition-colors hover:border-brand hover:bg-muted/40",
              "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
            )}
          >
            <FileUp className="size-5 text-muted-foreground" aria-hidden />
            <span className="min-w-0">
              <span className="block font-medium">
                {fileName || "Choose a CSV file"}
              </span>
              <span className="block text-xs text-muted-foreground">
                {fileName ? "Choose another file to replace it" : "Comma or semicolon separated"}
              </span>
            </span>
            <input
              type="file"
              accept=".csv,text/csv"
              aria-label="CSV file"
              onChange={readFile}
              className="sr-only"
            />
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => downloadCsv("subscribers-template.csv", templateCsv())}
          >
            <Download />
            Template
          </Button>
        </div>

        <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          {PUBLIC_DEMO_NOTICE}
        </p>

        {fileError && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {fileError}
          </p>
        )}

        {rows.length > 0 && (
          <fieldset className="grid gap-2">
            <legend className="mb-2 text-sm font-medium">Add the new subscribers as</legend>
            {statusChoices.map(({ value, label, hint }) => (
              <label key={value} className="flex items-start gap-2 text-sm">
                <input
                  type="radio"
                  name="import-status"
                  value={value}
                  checked={importStatus === value}
                  onChange={() => setImportStatus(value)}
                  className="mt-1 accent-[var(--brand)]"
                />
                <span>
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground"> - {hint}</span>
                </span>
              </label>
            ))}
            {importStatus === "active" && (
              <div className="mt-1 flex items-center gap-2 pl-5">
                <Checkbox
                  id="import-permission"
                  checked={hasPermission}
                  onCheckedChange={(checked) => setHasPermission(checked === true)}
                />
                <Label htmlFor="import-permission" className="font-normal">
                  I have permission to e-mail these people
                </Label>
              </div>
            )}
            {ignoresStatus && (
              <p className="text-xs text-muted-foreground">
                The file has a status column - it is not used, the status is chosen here.
              </p>
            )}
          </fieldset>
        )}

        {rows.length > 0 && (
          <div className="overflow-hidden rounded-lg border">
            <p className="border-b bg-muted/50 px-3 py-2 text-xs text-muted-foreground" aria-live="polite">
              <span className="font-medium text-foreground">{ready.length} ready</span>
              {withErrors > 0 && ` · ${withErrors} with errors (not imported)`}
            </p>
            <ul aria-label="Import preview" className="max-h-72 divide-y overflow-y-auto">
              {rows.map(({ line, fields, errors }) => (
                <li key={line} className="flex items-start gap-3 px-3 py-2 text-sm">
                  {errors.length === 0 ? (
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="ready" />
                  ) : (
                    <CircleX className="mt-0.5 size-4 shrink-0 text-destructive" aria-label="error" />
                  )}
                  <span className="w-12 shrink-0 text-xs text-muted-foreground">line {line}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {[fields.name, fields.surname].filter(Boolean).join(" ") || "-"}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {fields.email || "no e-mail"}
                    </span>
                    {errors.length > 0 && (
                      <span className="mt-0.5 block text-xs text-destructive">{errors.join(" · ")}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => close(false)}>
            Cancel
          </Button>
          <Button
            variant="brand"
            onClick={save}
            disabled={!canImport}
          >
            {isImporting
              ? "Importing..."
              : `Import ${pluralize(ready.length, "subscriber")}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportSubscribersDialog;
