import { useNavigate } from "react-router";

import { createEmail } from "services";
import { sendEmailTo } from "sendEmail";
import { useRecipients } from "customHooks/useRecipients";
import { toastMessage, toastSuccess } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { PageHeader } from "components/PageHeader";
import CampaignForm from "components/campaigns/CampaignForm";
import { CampaignFields, CampaignStatus } from "types";

const CreateEmailPage = () => {
  const navigate = useNavigate();
  const { receivers } = useRecipients();

  // back to the list - the new campaign is at the top (newest first)
  const handleSaved = (saved: CampaignFields, status: CampaignStatus) => {
    // a sent campaign is visible on the list (the demo note was in the confirmation) -
    // a draft gets a word, it is easy to miss that it was not sent
    if (status === "draft") toastSuccess(`Campaign "${saved.title}" has been saved as a draft`);
    navigate("/campaigns");
  };

  return (
    <StyledContainer>
      <PageHeader
        title="New campaign"
        description="Write a message, then save it as a draft or send it."
        back={{ to: "/campaigns", label: "Campaigns" }}
      />
      <CampaignForm
        onDraft={(data) =>
          createEmail({ data, status: "draft", callback: handleSaved })
        }
        onSend={async (data) => {
          if (!receivers.length) {
            toastMessage("Please choose at least one subscriber");
            return;
          }

          await sendEmailTo(data, receivers, () =>
            createEmail({ data, status: "sent", callback: handleSaved })
          );
        }}
      />
    </StyledContainer>
  );
};

export default CreateEmailPage;
