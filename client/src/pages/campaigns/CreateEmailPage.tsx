import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";

import { createEmail } from "services";
import { DEMO_EMAIL_NOTICE, sendEmailTo } from "sendEmail";
import { useSubscribers } from "customHooks/queries";
import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { useConfirmModalState } from "contexts/ConfirmModalContext";
import { validationCampaign, toastMessage } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { FormCampaign } from "components/FormCampaign";
import { CampaignFields, CampaignFormValues, CampaignStatus } from "types";

const styles = {
  questionSpan: { color: "crimson", fontWeight: "bold" },
  campaignName: { color: "green", fontWeight: "bold" },
} as const;

const CreateEmailPage = () => {
  const subscribersEndpoint = "/subscribers";
  const campaignsEndpoint = "/campaigns";
  const {
    handleSubmit,
    control,
    formState,
    formState: { errors },
    reset,
  } = useForm<CampaignFormValues>({
    resolver: yupResolver(validationCampaign),
  });

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data: subscribers } = useSubscribers();

  const allActiveSubscribers =
    (subscribers &&
      subscribers.filter(({ fields: { status } }) => status === "active")) ||
    [];

  const { finalSelectedActiveSubscribers } = useGlobalStoreContext();
  const { setConfirmModalState, setConfirmModalText } = useConfirmModalState();

  const confirmModalProps = {
    onConfirm: () => {
      if (
        !allActiveSubscribers.length &&
        pathname === `${campaignsEndpoint}/add`
      ) {
        navigate(`${subscribersEndpoint}/add`);
      } else {
        navigate(campaignsEndpoint);
      }
    },
    onClose: () => setConfirmModalState({ isOpenConfirmModal: false }),
  };

  const handleConfirmModal = (data: CampaignFields, status: CampaignStatus) => {
    setConfirmModalState({
      confirmModalProps,
      isOpenConfirmModal: true,
    });
    setConfirmModalText({
      additionalText: !allActiveSubscribers.length
        ? "No active Subscribers!"
        : status === "sent"
        ? DEMO_EMAIL_NOTICE
        : "",

      message: (
        <>
          Email has been
          {status === "sent"
            ? " sent and added to the list"
            : " drafted and added to the list"}
          😁
        </>
      ),
      question: !allActiveSubscribers.length ? (
        <>
          Would you like to create a
          <span style={styles.questionSpan}> new subscriber </span>?
        </>
      ) : (
        <>
          Would you like to come back to
          <span style={styles.questionSpan}> the Campaigns List</span> ?
        </>
      ),
    });
  };

  const { mutateAsync: draftCampaign } = useMutation(
    (data: CampaignFormValues) =>
      createEmail({ data, status: "draft", callback: handleConfirmModal })
  );

  const { mutateAsync: sendCampaign } = useMutation(
    async (data: CampaignFormValues) => {
      const receivers = finalSelectedActiveSubscribers ?? allActiveSubscribers;

      if (!receivers.length) {
        toastMessage("Please choose at least one subscriber");
        return;
      }

      return sendEmailTo(data, receivers, () =>
        createEmail({ data, status: "sent", callback: handleConfirmModal })
      );
    }
  );

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({
        title: "",
        description: "",
      });
    }
  }, [formState, reset]);

  return (
    <StyledContainer>
      <StyledHeading label="new email" />

      <StyledMainContent>
        <FormCampaign
          control={control}
          errors={errors}
          handleDraftData={handleSubmit((data) => draftCampaign(data))}
          handleSendData={handleSubmit((data) => sendCampaign(data))}
          disabledCheckbox={Boolean(subscribers) && !allActiveSubscribers.length}
          labelCheckbox={
            subscribers && !allActiveSubscribers.length
              ? "no active subscribers"
              : finalSelectedActiveSubscribers
              ? `selected subscribers: ${finalSelectedActiveSubscribers.length} from ${allActiveSubscribers.length}`
              : `active subscribers - ${allActiveSubscribers.length}`
          }
        />
      </StyledMainContent>
    </StyledContainer>
  );
};

export default CreateEmailPage;
