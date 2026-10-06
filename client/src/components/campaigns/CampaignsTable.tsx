import { ReactNode, useState } from "react";

import { usePaginatedData } from "customHooks/usePaginatedData";
import DataTablePagination, {
  PAGE_SIZES,
} from "components/DataTable/DataTablePagination";
import { Campaign } from "types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CampaignRow from "./CampaignRow";

interface CampaignsTableProps {
  title: string;
  campaigns: Campaign[];
  // e.g. the status filter
  toolbar?: ReactNode;
  emptyMessage?: ReactNode;
}

const CampaignsTable = ({
  title,
  campaigns,
  toolbar,
  emptyMessage = "There are no campaigns yet.",
}: CampaignsTableProps) => {
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const { page, pageCount, pageData, setPage } = usePaginatedData(
    campaigns,
    pageSize
  );

  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 border-b py-4">
        <CardTitle className="text-lg tracking-wide uppercase">{title}</CardTitle>
        {toolbar}
      </CardHeader>
      <CardContent className="px-0">
        {campaigns.length === 0 ? (
          <div className="px-6 py-10 text-center text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.map((campaign, index) => (
                  <CampaignRow
                    key={campaign.id}
                    campaign={campaign}
                    number={(page - 1) * pageSize + index + 1}
                  />
                ))}
              </TableBody>
            </Table>
            {campaigns.length > PAGE_SIZES[0] && (
              <DataTablePagination
                page={page}
                pageCount={pageCount}
                onPageChange={setPage}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
                total={campaigns.length}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignsTable;
