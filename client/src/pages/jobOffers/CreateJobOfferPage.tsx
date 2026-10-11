import { useNavigate } from "react-router";

import { createJobOffer } from "services";
import { useSendJobOffer } from "customHooks/useSendJobOffer";
import { toastSuccess } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { PageHeader } from "components/PageHeader";
import JobOfferForm from "components/jobOffers/JobOfferForm";
import { JobOfferFields, JobOfferStatus } from "types";

const CreateJobOfferPage = () => {
  const navigate = useNavigate();
  const send = useSendJobOffer();

  // back to the list - the new job offer is at the top (newest first)
  const handleSaved = (saved: JobOfferFields, status: JobOfferStatus) => {
    // a sent job offer is visible on the list (the demo note was in the confirmation) -
    // a draft gets a word, it is easy to miss that it was not sent
    if (status === "draft") toastSuccess(`Job offer "${saved.subject}" has been saved as a draft`);
    navigate("/job-offers");
  };

  return (
    <StyledContainer>
      <PageHeader
        title="New job offer"
        description="Write a message, then save it as a draft or send it."
        back={{ to: "/job-offers", label: "Job offers" }}
      />
      <JobOfferForm
        onDraft={(data) =>
          createJobOffer({ data, status: "draft", callback: handleSaved })
        }
        onSend={send}
      />
    </StyledContainer>
  );
};

export default CreateJobOfferPage;
