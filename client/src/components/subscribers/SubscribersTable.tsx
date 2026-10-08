import { ReactNode } from "react";
import { Download } from "lucide-react";

import { useTableData } from "customHooks/useTableData";
import DataTablePagination, {
  PAGE_SIZES,
} from "components/DataTable/DataTablePagination";
import SortableDateHead, {
  SortDirectionButton,
} from "components/DataTable/SortableDateHead";
import SearchInput from "components/DataTable/SearchInput";
import StatusFilter from "components/DataTable/StatusFilter";
import { downloadCsv } from "helpers/csv";
import { Subscriber, SubscriberStatus } from "types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SubscriberCard from "./SubscriberCard";
import SubscriberRow from "./SubscriberRow";
import { subscribersToCsv } from "./subscribersCsv";

const statuses: SubscriberStatus[] = ["active", "pending", "blocked", "unsubscribed"];

interface SubscribersTableProps {
  subscribers: Subscriber[];
  withActions?: boolean;
  // shown when there are no subscribers at all
  emptyMessage?: ReactNode;
}

const SubscribersTable = ({
  subscribers,
  withActions = true,
  emptyMessage = "There are no subscribers yet.",
}: SubscribersTableProps) => {
  const table = useTableData(
    subscribers,
    ({ fields }) => `${fields.name} ${fields.surname} ${fields.email}`
  );

  // what the list shows - after the search, the filter and the order
  const exportCsv = () =>
    downloadCsv(
      `subscribers-${new Date().toISOString().slice(0, 10)}.csv`,
      subscribersToCsv(table.rows)
    );

  if (subscribers.length === 0) {
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
          label="Search subscribers"
          placeholder="Search name or e-mail"
          className="w-full sm:w-64"
        />
        <StatusFilter
          statuses={statuses}
          value={table.status}
          onChange={table.setStatus}
        />
        <div className="ml-auto flex items-center gap-2">
          {/* phones have no "Date" header to click */}
          {table.rows.length > 1 && (
            <SortDirectionButton
              direction={table.direction}
              onToggle={table.toggleDirection}
              className="md:hidden"
            />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            disabled={table.rows.length === 0}
            title="Download the subscribers shown in the list"
          >
            <Download />
            Export CSV
          </Button>
        </div>
      </div>

      {table.rows.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-muted-foreground">
          {table.query
            ? `No subscribers match "${table.query}"${table.status === "all" ? "" : ` with the status ${table.status}`}.`
            : `There are no subscribers with the status ${table.status}.`}
        </p>
      ) : (
        <>
          {/* a table from tablets up, cards on a phone */}
          <div className="hidden md:block">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-4">Subscriber</TableHead>
                  <TableHead>Status</TableHead>
                  <SortableDateHead
                    direction={table.direction}
                    onToggle={table.toggleDirection}
                  />
                  {withActions && (
                    <TableHead className="pr-4 text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.pageData.map((subscriber) => (
                  <SubscriberRow
                    key={subscriber.id}
                    subscriber={subscriber}
                    withActions={withActions}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          <ul aria-label="Subscribers" className="divide-y md:hidden">
            {table.pageData.map((subscriber) => (
              <SubscriberCard
                key={subscriber.id}
                subscriber={subscriber}
                withActions={withActions}
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

export default SubscribersTable;
