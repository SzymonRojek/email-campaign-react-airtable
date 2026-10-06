import { ReactNode, useState } from "react";

import { usePaginatedData } from "customHooks/usePaginatedData";
import DataTablePagination, {
  PAGE_SIZES,
} from "components/DataTable/DataTablePagination";
import { Subscriber } from "types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SubscriberRow from "./SubscriberRow";

interface SubscribersTableProps {
  title: string;
  subscribers: Subscriber[];
  withActions?: boolean;
  // e.g. the status filter
  toolbar?: ReactNode;
  emptyMessage?: ReactNode;
}

const SubscribersTable = ({
  title,
  subscribers,
  withActions = true,
  toolbar,
  emptyMessage = "There are no subscribers yet.",
}: SubscribersTableProps) => {
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const { page, pageCount, pageData, setPage } = usePaginatedData(
    subscribers,
    pageSize
  );

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b py-4">
        <CardTitle className="text-lg tracking-wide uppercase">{title}</CardTitle>
        {toolbar}
      </CardHeader>
      <CardContent className="px-0">
        {subscribers.length === 0 ? (
          <div className="px-6 py-10 text-center text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Surname</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  {withActions && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.map((subscriber, index) => (
                  <SubscriberRow
                    key={subscriber.id}
                    subscriber={subscriber}
                    number={(page - 1) * pageSize + index + 1}
                    withActions={withActions}
                  />
                ))}
              </TableBody>
            </Table>
            {subscribers.length > PAGE_SIZES[0] && (
              <DataTablePagination
                page={page}
                pageCount={pageCount}
                onPageChange={setPage}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
                total={subscribers.length}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscribersTable;
