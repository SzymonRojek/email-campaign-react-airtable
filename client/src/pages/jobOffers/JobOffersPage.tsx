import { Link } from "react-router";
import { Plus } from "lucide-react";

import { pluralize } from "helpers";
import { useJobOffers } from "customHooks/queries";
import { Error, Loader } from "components/DisplayMessage";
import { PageHeader } from "components/PageHeader";
import { StyledContainer } from "components/StyledContainer";
import JobOffersTable from "components/jobOffers/JobOffersTable";
import { Button } from "@/components/ui/button";

const JobOffersPage = () => {
  const { data: jobOffers, isLoading, isError, refetch, isFetching } = useJobOffers(
    "Cannot get the job offers list."
  );

  if (isLoading) return <Loader />;
  if (isError || !jobOffers)
    return (
      <Error
        error="Cannot load the job offers - please try again later."
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );

  const sent = jobOffers.filter(({ fields }) => fields.status === "sent");

  return (
    <StyledContainer>
      <PageHeader
        title="Job offers"
        description={`${pluralize(jobOffers.length, "job offer")} · ${sent.length} sent · ${pluralize(jobOffers.length - sent.length, "draft")}`}
        actions={
          <Button asChild variant="brand">
            <Link to="/job-offers/add">
              <Plus />
              New job offer
            </Link>
          </Button>
        }
      />
      <JobOffersTable
        jobOffers={jobOffers}
        emptyMessage="There are no job offers yet - write the first one."
      />
    </StyledContainer>
  );
};

export default JobOffersPage;
