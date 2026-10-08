import { ReactNode, useState } from "react";
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
import { toastMessage } from "helpers";
import { getErrorMessage } from "services";
import api from "services/api";
import { Campaign, CampaignStatus, SentEmail } from "types";
import { Button } from "@/components/ui/button";
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
import { emailsToCsv, sentEmailsFileName } from "./emailsCsv";

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
  const [isExporting, setIsExporting] = useState(false);
  // what the list shows - only the sent campaigns have e-mails
  const shownSent = table.rows.filter(({ fields }) => fields.status === "sent");

  // every e-mail of the sent campaigns the list shows (after the search and the filter)
  const exportEmails = async () => {
    setIsExporting(true);
    try {
      const ids = new Set(shownSent.map(({ id }) => id));
      const emails = (await api.get<SentEmail[]>("/emails")).filter(({ campaignId }) =>
        ids.has(campaignId)
      );
      downloadCsv(sentEmailsFileName(), emailsToCsv(emails, true));
    } catch (error) {
      toastMessage(`The e-mails have not been exported: ${getErrorMessage(error)}`);
    } finally {
      setIsExporting(false);
    }
  };

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
            onClick={exportEmails}
            disabled={shownSent.length === 0 || isExporting}
            title="Download every e-mail of the sent campaigns shown in the list"
          >
            <Download />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
        </div>
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
