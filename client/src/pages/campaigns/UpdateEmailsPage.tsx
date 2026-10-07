import { useNavigate, useParams } from "react-router";

import { updateEmail } from "services";
import { sendEmailTo } from "sendEmail";
import { useCampaign } from "customHooks/queries";
import { useRecipients } from "customHooks/useRecipients";
import { toastMessage } from "helpers";
import { Error, Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { PageHeader } from "components/PageHeader";
import CampaignForm from "components/campaigns/CampaignForm";
import toastCampaignSaved from "components/campaigns/toastCampaignSaved";
import { CampaignFields, CampaignStatus } from "types";

const UpdateEmailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { receivers } = useRecipients();
  const { data: campaign, isLoading, isError } = useCampaign(
    id,
    "Campaign does not exist! "
  );

  const handleSaved = (saved: CampaignFields, status: CampaignStatus) => {
    toastCampaignSaved(saved.title, status);
    navigate("/campaigns");
  };

  if (isLoading) return <Loader />;
  if (isError || !campaign)
    return <Error error="Email Campaign does not exist!" />;

  return (
    <StyledContainer>
      <PageHeader
        title="Edit campaign"
        description="Only drafts can be changed - sending makes the campaign final."
        back={{ to: "/campaigns", label: "Campaigns" }}
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
        onSend={async (data) => {
          if (!receivers.length) {
            toastMessage("Please choose at least one subscriber");
            return;
          }

          await sendEmailTo(data, receivers, () =>
            updateEmail({ data, status: "sent", id, callback: handleSaved })
          );
        }}
      />
    </StyledContainer>
  );
};

export default UpdateEmailsPage;
