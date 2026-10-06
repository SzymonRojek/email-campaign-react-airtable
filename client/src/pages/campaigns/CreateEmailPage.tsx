import { useNavigate } from "react-router-dom";

import { createEmail } from "services";
import { DEMO_EMAIL_NOTICE, sendEmailTo } from "sendEmail";
import { useRecipients } from "customHooks/useRecipients";
import { useConfirmModalState } from "contexts/ConfirmModalContext";
import { toastMessage } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import CampaignForm from "components/campaigns/CampaignForm";
import { CampaignFields, CampaignStatus } from "types";

const CreateEmailPage = () => {
  const navigate = useNavigate();
  const { receivers, hasNoActiveSubscribers } = useRecipients();
  const { setConfirmModalState, setConfirmModalText } = useConfirmModalState();

  const handleSaved = (_: CampaignFields, status: CampaignStatus) => {
    setConfirmModalText({
      additionalText: hasNoActiveSubscribers
        ? "No active Subscribers!"
        : status === "sent"
        ? DEMO_EMAIL_NOTICE
        : "",
      message: `Email has been ${
        status === "sent" ? "sent" : "drafted"
      } and added to the list 😁`,
      question: hasNoActiveSubscribers
        ? "Would you like to create a new subscriber?"
        : "Would you like to come back to the campaigns list?",
    });
    setConfirmModalState({
      isOpenConfirmModal: true,
      confirmModalProps: {
        onConfirm: () =>
          navigate(hasNoActiveSubscribers ? "/subscribers/add" : "/campaigns"),
        onClose: () => setConfirmModalState({ isOpenConfirmModal: false }),
      },
    });
  };

  return (
    <StyledContainer>
      <StyledHeading label="new email" />
      <CampaignForm
        resetAfterSubmit
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
