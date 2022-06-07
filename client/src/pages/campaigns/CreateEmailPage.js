import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";

import api from "api";
import { sendEmailTo } from "sendEmail";
import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { useConfirmModalState } from "contexts/ConfirmModalContext";
import {
  capitalizeFirstLetter,
  validationCampaign,
  toastMessage,
} from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { FormCampaign } from "components/FormCampaign";

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
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationCampaign),
  });

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data: subscribers } = useQuery(subscribersEndpoint, api.fetchItems);

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

  const setDataConfirmModal = (data, status) => {
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
          Email{" "}
          <span style={styles.campaignName}>
            {" "}
            {capitalizeFirstLetter(data.title)}{" "}
          </span>
          has been{" "}
          {status === "sent"
            ? "sent and added to the list"
            : "drafted and added to the list"}
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

  const postDataEmailToAirtable = async (data, status) => {
    const postData = {
      fields: {
        title: capitalizeFirstLetter(data.title),
        description: capitalizeFirstLetter(data.description),
        status,
      },
    };

    try {
      const response = await api.post(campaignsEndpoint, postData);

      setDataConfirmModal(response.fields, status);
    } catch (error) {
      toastMessage(`Data were not been sent to the Airtable: ${error.message}`);
    }
  };

  const { mutateAsync: draftCampaign } = useMutation((data) =>
    postDataEmailToAirtable(data, "draft")
  );

  const { mutateAsync: sendCampaign } = useMutation((data) => {
    if (finalSelectedActiveSubscribers.length) {
      sendEmailTo(
        data,
        finalSelectedActiveSubscribers.length
          ? finalSelectedActiveSubscribers
          : allActiveSubscribers,
        postDataEmailToAirtable
      );

      reset({
        title: "",
        description: "",
      });
    }
  });

  return (
    <StyledContainer>
      <StyledHeading label="new email" />

      <StyledMainContent>
        <FormCampaign
          control={control}
          errors={errors}
          handleDraftData={handleSubmit(draftCampaign)}
          handleSendData={handleSubmit(sendCampaign)}
          disabledCheckbox={!!!allActiveSubscribers.length}
          labelCheckbox={
            !allActiveSubscribers.length
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
