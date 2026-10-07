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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  title: string;
  subscribers: Subscriber[];
  withActions?: boolean;
  // e.g. the "Add subscriber" button
  action?: ReactNode;
  // shown when there are no subscribers at all
  emptyMessage?: ReactNode;
}

const SubscribersTable = ({
  title,
  subscribers,
  withActions = true,
  action,
  emptyMessage = "There are no subscribers yet.",
}: SubscribersTableProps) => {
  const table = useTableData(subscribers);

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b py-4">
        <CardTitle className="text-lg tracking-wide uppercase">{title}</CardTitle>
        <div className="flex flex-wrap items-center gap-3">
          {/* phones have no "Date" header to click */}
          {table.rows.length > 1 && (
            <SortDirectionButton
              direction={table.direction}
              onToggle={table.toggleDirection}
              className="md:hidden"
            />
          )}
          {subscribers.length > 0 && (
            <StatusFilter
              statuses={statuses}
              value={table.status}
              onChange={table.setStatus}
            />
          )}
          {action}
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {table.rows.length === 0 ? (
          <div className="px-6 py-10 text-center text-muted-foreground">
            {subscribers.length === 0
              ? emptyMessage
              : `There are no subscribers with the status ${table.status}.`}
          </div>
        ) : (
          <>
            {/* a table from tablets up, cards on a phone */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Surname</TableHead>
                    <TableHead>Status</TableHead>
                    <SortableDateHead
                      direction={table.direction}
                      onToggle={table.toggleDirection}
                    />
                    {withActions && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.pageData.map((subscriber, index) => (
                    <SubscriberRow
                      key={subscriber.id}
                      subscriber={subscriber}
                      number={(table.page - 1) * table.pageSize + index + 1}
                      withActions={withActions}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
            <ul aria-label={title} className="divide-y md:hidden">
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
      </CardContent>
    </Card>
  );
};

export default SubscribersTable;
