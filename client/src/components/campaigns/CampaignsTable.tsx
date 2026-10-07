import { ReactNode } from "react";

import { useTableData } from "customHooks/useTableData";
import DataTablePagination, {
  PAGE_SIZES,
} from "components/DataTable/DataTablePagination";
import SortableDateHead, {
  SortDirectionButton,
} from "components/DataTable/SortableDateHead";
import StatusFilter from "components/DataTable/StatusFilter";
import { Campaign, CampaignStatus } from "types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CampaignCard from "./CampaignCard";
import CampaignRow from "./CampaignRow";

const statuses: CampaignStatus[] = ["sent", "draft"];

interface CampaignsTableProps {
  title: string;
  campaigns: Campaign[];
  // e.g. the "Add campaign" button
  action?: ReactNode;
  // shown when there are no campaigns at all
  emptyMessage?: ReactNode;
}

const CampaignsTable = ({
  title,
  campaigns,
  action,
  emptyMessage = "There are no campaigns yet.",
}: CampaignsTableProps) => {
  const table = useTableData(campaigns);

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
          {campaigns.length > 0 && (
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
            {campaigns.length === 0
              ? emptyMessage
              : `There are no campaigns with the status ${table.status}.`}
          </div>
        ) : (
          <>
            {/* a table from tablets up, cards on a phone */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <SortableDateHead
                      direction={table.direction}
                      onToggle={table.toggleDirection}
                    />
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.pageData.map((campaign, index) => (
                    <CampaignRow
                      key={campaign.id}
                      campaign={campaign}
                      number={(table.page - 1) * table.pageSize + index + 1}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
            <ul aria-label={title} className="divide-y md:hidden">
              {table.pageData.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
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

export default CampaignsTable;
