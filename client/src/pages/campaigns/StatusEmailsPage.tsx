import { useState } from "react";

import { getFilteredDataByStatus } from "helpers";
import { useCampaigns } from "customHooks/queries";
import { Error, Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import CampaignsTable from "components/campaigns/CampaignsTable";
import { CampaignStatus } from "types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses: CampaignStatus[] = ["sent", "draft"];

const StatusEmailsPage = () => {
  const [status, setStatus] = useState<CampaignStatus>("sent");
  const { data: campaigns, isLoading, isError } = useCampaigns(
    "Can not get campaigns status list:"
  );

  if (isLoading) return <Loader />;
  if (isError || !campaigns)
    return <Error error="Cannot load the campaigns - please try again later." />;

  return (
    <StyledContainer>
      <StyledHeading label="email status" />
      <CampaignsTable
        // a new filter starts from the first page
        key={status}
        title="List"
        campaigns={getFilteredDataByStatus(campaigns, status)}
        emptyMessage={`There are no campaigns with the status ${status}.`}
        toolbar={
          <div className="flex items-center gap-2">
            <Label htmlFor="status-id">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as CampaignStatus)}
            >
              <SelectTrigger id="status-id" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />
    </StyledContainer>
  );
};

export default StatusEmailsPage;
