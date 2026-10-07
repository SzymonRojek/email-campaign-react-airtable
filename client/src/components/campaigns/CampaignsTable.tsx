import { ReactNode } from "react";

import { useTableData } from "customHooks/useTableData";
import DataTablePagination, {
  PAGE_SIZES,
} from "components/DataTable/DataTablePagination";
import SortableDateHead, {
  SortDirectionButton,
} from "components/DataTable/SortableDateHead";
import SearchInput from "components/DataTable/SearchInput";
import StatusFilter from "components/DataTable/StatusFilter";
import { Campaign, CampaignStatus } from "types";
import { Card } from "@/components/ui/card";
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
  campaigns: Campaign[];
  // shown when there are no campaigns at all
  emptyMessage?: ReactNode;
}

const CampaignsTable = ({
  campaigns,
  emptyMessage = "There are no campaigns yet.",
}: CampaignsTableProps) => {
  const table = useTableData(
    campaigns,
    ({ fields }) => `${fields.title} ${fields.description}`
  );

  if (campaigns.length === 0) {
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
          label="Search campaigns"
          placeholder="Search title or description"
          className="w-full sm:w-64"
        />
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
            className="ml-auto md:hidden"
          />
        )}
      </div>

      {table.rows.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-muted-foreground">
          {table.query
            ? `No campaigns match "${table.query}"${table.status === "all" ? "" : ` with the status ${table.status}`}.`
            : `There are no campaigns with the status ${table.status}.`}
        </p>
      ) : (
        <>
          {/* a table from tablets up, cards on a phone */}
          <div className="hidden md:block">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-4">Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <SortableDateHead
                    direction={table.direction}
                    onToggle={table.toggleDirection}
                  />
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.pageData.map((campaign) => (
                  <CampaignRow key={campaign.id} campaign={campaign} />
                ))}
              </TableBody>
            </Table>
          </div>
          <ul aria-label="Campaigns" className="divide-y md:hidden">
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
    </Card>
  );
};

export default CampaignsTable;
