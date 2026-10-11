import { useState } from "react";
import { Plus, Upload } from "lucide-react";

import { pluralize } from "helpers";
import { useCandidates } from "customHooks/queries";
import { useCandidatePanel } from "customHooks/useCandidatePanel";
import { Error, Loader } from "components/DisplayMessage";
import { PageHeader } from "components/PageHeader";
import { StyledContainer } from "components/StyledContainer";
import ImportCandidatesDialog from "components/candidates/ImportCandidatesDialog";
import CandidateDetailsPanel from "components/candidates/CandidateDetailsPanel";
import CandidatesTable from "components/candidates/CandidatesTable";
import { Button } from "@/components/ui/button";

const CandidatesPage = () => {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const panel = useCandidatePanel();
  const { data: candidates, isLoading, isError, refetch, isFetching } = useCandidates(
    "Cannot get the candidates list."
  );

  if (isLoading) return <Loader />;
  if (isError || !candidates)
    return (
      <Error
        error="Cannot load the candidates - please try again later."
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );

  const active = candidates.filter(({ fields }) => fields.status === "open to offers");

  return (
    <StyledContainer>
      <PageHeader
        title="Candidates"
        description={`${pluralize(candidates.length, "candidate")} · ${active.length} open to offers`}
        actions={
          <>
            <Button variant="outline" onClick={() => setIsImportOpen(true)}>
              <Upload />
              Import CSV
            </Button>
            <Button variant="brand" onClick={panel.create}>
              <Plus />
              Add candidate
            </Button>
          </>
        }
      />
      <ImportCandidatesDialog isOpen={isImportOpen} onOpenChange={setIsImportOpen} />
      <CandidateDetailsPanel />
      <CandidatesTable
        candidates={candidates}
        emptyMessage="There are no candidates yet - add the first one."
      />
    </StyledContainer>
  );
};

export default CandidatesPage;
