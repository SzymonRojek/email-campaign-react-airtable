import { useState } from "react";

import { getFilteredDataByStatus } from "helpers";
import { useSubscribers } from "customHooks/queries";
import { Error, Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import SubscribersTable from "components/subscribers/SubscribersTable";
import { SubscriberStatus } from "types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses: SubscriberStatus[] = ["active", "pending", "blocked"];

const StatusSubscribersPage = () => {
  const [status, setStatus] = useState<SubscriberStatus>("active");
  const { data: subscribers, isLoading, isError } = useSubscribers(
    "Cannot get subscribers list:"
  );

  if (isLoading) return <Loader />;
  if (isError || !subscribers)
    return <Error error="Cannot load the subscribers - please try again later." />;

  return (
    <StyledContainer>
      <StyledHeading label="subscribers status" />
      <SubscribersTable
        // a new filter starts from the first page
        key={status}
        title="List"
        subscribers={getFilteredDataByStatus(subscribers, status)}
        emptyMessage={`There are no subscribers with the status ${status}.`}
        toolbar={
          <div className="flex items-center gap-2">
            <Label htmlFor="status-id">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as SubscriberStatus)}
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

export default StatusSubscribersPage;
