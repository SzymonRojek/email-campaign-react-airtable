import { ReactNode } from "react";
import { Download } from "lucide-react";

import { useLastContacted } from "customHooks/useLastContacted";
import { useTableData } from "customHooks/useTableData";
import DataTablePagination, {
  PAGE_SIZES,
} from "components/DataTable/DataTablePagination";
import SortableDateHead, {
  SortDirectionButton,
} from "components/DataTable/SortableDateHead";
import SearchInput from "components/DataTable/SearchInput";
import StatusFilter from "components/DataTable/StatusFilter";
import { statusLabel } from "helpers";
import { downloadCsv } from "helpers/csv";
import { Candidate, CandidateStatus } from "types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CandidateCard from "./CandidateCard";
import CandidateRow from "./CandidateRow";
import { candidatesToCsv } from "./candidatesCsv";

const statuses: CandidateStatus[] = ["open to offers", "awaiting consent", "do not contact", "opted out"];

interface CandidatesTableProps {
  candidates: Candidate[];
  withActions?: boolean;
  // shown when there are no candidates at all
  emptyMessage?: ReactNode;
}

const CandidatesTable = ({
  candidates,
  withActions = true,
  emptyMessage = "There are no candidates yet.",
}: CandidatesTableProps) => {
  const lastContacted = useLastContacted();
  const table = useTableData(
    candidates,
    ({ fields }) => `${fields.name} ${fields.surname} ${fields.email} ${fields.role ?? ""}`
  );

  // what the list shows - after the search, the filter and the order
  const exportCsv = () =>
    downloadCsv(
      `candidates-${new Date().toISOString().slice(0, 10)}.csv`,
      candidatesToCsv(table.rows)
    );

  if (candidates.length === 0) {
    return (
      <Card className="items-center px-6 py-16 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </Card>
    );
  }

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
        <SearchInput
          value={table.query}
          onChange={table.setQuery}
          label="Search candidates"
          placeholder="Search name, e-mail or role"
          className="w-full sm:w-64"
        />
        <StatusFilter
          statuses={statuses}
          value={table.status}
          onChange={table.setStatus}
        />
        <div className="ml-auto flex items-center gap-2">
          {/* phones (and tablets) have no "Added" header to click */}
          {table.rows.length > 1 && (
            <SortDirectionButton
              direction={table.direction}
              onToggle={table.toggleDirection}
              className="lg:hidden"
            />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            disabled={table.rows.length === 0}
            title="Download the candidates shown in the list"
          >
            <Download />
            Export CSV
          </Button>
        </div>
      </div>

      {table.rows.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-muted-foreground">
          {table.query
            ? `No candidates match "${table.query}"${table.status === "all" ? "" : ` with the status "${statusLabel(table.status)}"`}.`
            : `There are no candidates with the status "${statusLabel(table.status)}".`}
        </p>
      ) : (
        <>
          {/* a table from tablets up, cards on a phone */}
          <div className="hidden md:block">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-4">Candidate</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last contacted</TableHead>
                  <SortableDateHead
                    label="Added"
                    className="hidden lg:table-cell"
                    direction={table.direction}
                    onToggle={table.toggleDirection}
                  />
                  {withActions && (
                    <TableHead className="pr-4 text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.pageData.map((candidate) => (
                  <CandidateRow
                    key={candidate.id}
                    candidate={candidate}
                    withActions={withActions}
                    lastContacted={lastContacted.get(candidate.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          <ul aria-label="Candidates" className="divide-y md:hidden">
            {table.pageData.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                withActions={withActions}
                lastContacted={lastContacted.get(candidate.id)}
              />
            ))}
          </ul>
          {table.rows.length > PAGE_SIZES[0] && (
            <DataTablePagination
              page={table.page}
              pageCount={table.pageCount}
              onPageChange={table.setPage}
              pageSize={table.pageSize}
              onPageSizeChange={table.setPageSize}
              total={table.rows.length}
            />
          )}
        </>
      )}
    </Card>
  );
};

export default CandidatesTable;
