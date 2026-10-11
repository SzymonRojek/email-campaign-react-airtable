import { Navigate, useNavigate, useParams } from "react-router";

import { updateEmail } from "services";
import { useCampaign } from "customHooks/queries";
import { useSendCampaign } from "customHooks/useSendCampaign";
import { Error, Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { PageHeader } from "components/PageHeader";
import CampaignForm from "components/campaigns/CampaignForm";

const UpdateEmailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const send = useSendCampaign(id);
  const { data: campaign, isLoading, isError } = useCampaign(
    id,
    "Job offer does not exist! "
  );

  // back to the list - the saved draft is there, no toast needed
  const handleSaved = () => navigate("/campaigns");

  if (isLoading) return <Loader />;
  if (isError || !campaign)
    return <Error error="Job offer does not exist!" />;

  // a sent campaign is final - its page shows who got it
  if (campaign.fields.status === "sent") return <Navigate to={`/campaigns/${id}`} replace />;

  return (
    <StyledContainer>
      <PageHeader
        title="Edit job offer"
        description="Only drafts can be changed - sending makes the offer final."
        back={{ to: "/campaigns", label: "Job offers" }}
      />
      {/* the form gets the loaded data as its starting values */}
      <CampaignForm
        defaultValues={{
          title: campaign.fields.title ?? "",
          description: campaign.fields.description ?? "",
        }}
        onDraft={(data) =>
          updateEmail({ data, status: "draft", id, callback: handleSaved })
        }
        onSend={send}
      />
    </StyledContainer>
  );
};

export default UpdateEmailsPage;
