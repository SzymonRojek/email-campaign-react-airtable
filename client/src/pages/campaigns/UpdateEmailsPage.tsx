import { useNavigate, useParams } from "react-router-dom";

import { updateEmail } from "services";
import { DEMO_EMAIL_NOTICE, sendEmailTo } from "sendEmail";
import { useCampaign } from "customHooks/queries";
import { useRecipients } from "customHooks/useRecipients";
import { useInformationModalState } from "contexts/InformationModalContext";
import { toastMessage } from "helpers";
import { Error, Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import CampaignForm from "components/campaigns/CampaignForm";
import { CampaignFields, CampaignStatus } from "types";

const UpdateEmailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { receivers } = useRecipients();
  const { data: campaign, isLoading, isError } = useCampaign(
    id,
    "Campaign does not exist! "
  );
  const { setInformationModalState, setInformationModalText } =
    useInformationModalState();

  const handleSaved = (saved: CampaignFields, status: CampaignStatus) => {
    setInformationModalText(
      status === "sent"
        ? {
            title: "That's great 🎊",
            additionalText: DEMO_EMAIL_NOTICE,
            message: `Email ${saved.title} has been sent 👋`,
          }
        : { title: "Draft... 👋", message: `Email ${saved.title} is drafted 👋` }
    );
    setInformationModalState({
      isOpenInformationModal: true,
      informationModalProps: {
        colorButton: "success",
        onClose: () => {
          setInformationModalState({ isOpenInformationModal: false });
          navigate("/campaigns");
        },
      },
    });
  };

  if (isLoading) return <Loader />;
  if (isError || !campaign)
    return <Error error="Email Campaign does not exist!" />;

  return (
    <StyledContainer>
      <StyledHeading label="update email" />
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
