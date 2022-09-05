import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";

import { fetchData, createEmail } from "services";
import { sendEmailTo } from "sendEmail";
import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { useConfirmModalState } from "contexts/ConfirmModalContext";
import { validationCampaign } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { FormCampaign } from "components/FormCampaign";
import { useEffect } from "react";

const styles = {
  questionSpan: { color: "crimson", fontWeight: "bold" },
  campaignName: { color: "green", fontWeight: "bold" },
};

const CreateEmailPage = () => {
  const subscribersEndpoint = "/subscribers";
  const campaignsEndpoint = "/campaigns";
  const {
    handleSubmit,
    control,
    formState,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationCampaign),
  });

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data: subscribers } = useQuery(subscribersEndpoint, fetchData);

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

  const handleConfirmModal = (data, status) => {
    setConfirmModalState({
      confirmModalProps,
      isOpenConfirmModal: true,
    });
    setConfirmModalText({
      additionalText: !allActiveSubscribers.length
        ? "No active Subscribers!"
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

  const { mutateAsync: draftCampaign } = useMutation((data) =>
    createEmail({ data, status: "draft", callback: handleConfirmModal })
  );

  const { mutateAsync: sendCampaign } = useMutation((data) => {
    sendEmailTo(
      data,
      finalSelectedActiveSubscribers.length
        ? finalSelectedActiveSubscribers
        : allActiveSubscribers,
      () => createEmail({ data, status: "sent", callback: handleConfirmModal })
    );
  });

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
          handleDraftData={handleSubmit(draftCampaign)}
          handleSendData={handleSubmit(sendCampaign)}
          disabledCheckbox={subscribers && !allActiveSubscribers.length}
          labelCheckbox={
            subscribers && !allActiveSubscribers.length
              ? "no active subscribers"
              : finalSelectedActiveSubscribers.length
              ? `selected subscribers: ${finalSelectedActiveSubscribers.length} from ${allActiveSubscribers.length}`
              : `active subscribers - ${allActiveSubscribers.length}`
          }
        />
      </StyledMainContent>
    </StyledContainer>
  );
};

export default CreateEmailPage;
