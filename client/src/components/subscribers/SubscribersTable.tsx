import { ReactNode } from "react";

import { useTableData } from "customHooks/useTableData";
import DataTablePagination, {
  PAGE_SIZES,
} from "components/DataTable/DataTablePagination";
import SortableDateHead, {
  SortDirectionButton,
} from "components/DataTable/SortableDateHead";
import StatusFilter from "components/DataTable/StatusFilter";
import { Subscriber, SubscriberStatus } from "types";
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

const statuses: SubscriberStatus[] = ["active", "pending", "blocked"];

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
  const table = useTableData(subscribers);

  if (subscribers.length === 0) {
    return (
      <Card className="items-center px-6 py-16 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </Card>
    );
  }

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <StatusFilter
          statuses={statuses}
          value={table.status}
          onChange={table.setStatus}
        />
        {/* phones have no "Date" header to click */}
        {table.rows.length > 1 && (
          <SortDirectionButton
            direction={table.direction}
            onToggle={table.toggleDirection}
            className="md:hidden"
          />
        )}
      </div>

      {table.rows.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-muted-foreground">
          There are no subscribers with the status {table.status}.
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
