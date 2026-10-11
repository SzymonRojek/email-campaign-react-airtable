import { Navigate, useNavigate, useParams } from "react-router";

import { updateJobOffer } from "services";
import { useJobOffer } from "customHooks/queries";
import { useSendJobOffer } from "customHooks/useSendJobOffer";
import { Error, Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { PageHeader } from "components/PageHeader";
import JobOfferForm from "components/jobOffers/JobOfferForm";

const UpdateJobOfferPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const send = useSendJobOffer(id);
  const { data: jobOffer, isLoading, isError } = useJobOffer(
    id,
    "Job offer does not exist! "
  );

  // back to the list - the saved draft is there, no toast needed
  const handleSaved = () => navigate("/job-offers");

  if (isLoading) return <Loader />;
  if (isError || !jobOffer)
    return <Error error="Job offer does not exist!" />;

  // a sent job offer is final - its page shows who got it
  if (jobOffer.fields.status === "sent") return <Navigate to={`/job-offers/${id}`} replace />;

  return (
    <StyledContainer>
      <PageHeader
        title="Edit job offer"
        description="Only drafts can be changed - sending makes the offer final."
        back={{ to: "/job-offers", label: "Job offers" }}
      />
      {/* the form gets the loaded data as its starting values */}
      <JobOfferForm
        defaultValues={{
          subject: jobOffer.fields.subject ?? "",
          message: jobOffer.fields.message ?? "",
        }}
        onDraft={(data) =>
          updateJobOffer({ data, status: "draft", id, callback: handleSaved })
        }
        onSend={send}
      />
    </StyledContainer>
  );
};

export default UpdateJobOfferPage;
