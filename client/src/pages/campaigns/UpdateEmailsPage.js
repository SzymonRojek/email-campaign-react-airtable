import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery } from "react-query";

import api from "api";
import { sendEmailTo } from "sendEmail";
import { useConfirmModalState } from "contexts/ConfirmModalContext";
import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import {
  capitalizeFirstLetter,
  validationCampaign,
  toastMessage,
} from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { FormCampaign } from "components/FormCampaign";
import { StyledHeading } from "components/StyledHeading";
import { Loader } from "components/DisplayMessage";

const styles = {
  title: { color: "green", fontWeight: "bold" },
  questionSpan: { color: "crimson", fontWeight: "bold" },
  campaignName: { color: "green", fontWeight: "bold" },
};

const UpdateEmailsPage = () => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(validationCampaign),
  });

  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data: subscribers } = useQuery("subscribers", api.fetchItems);

  const {
    data: campaign,
    isLoading,
    isFetching,
  } = useQuery(["campaigns", { id }], api.fetchDetailsItemById, {
    meta: {
      myMessage: "Campaign does not exist! ",
    },
  });

  const { finalSelectedActiveSubscribers } = useGlobalStoreContext();
  const { setConfirmModalState, setConfirmModalText } = useConfirmModalState();

  const defaultValues = {
    title: campaign ? campaign.fields.title : "",
    description: campaign ? campaign.fields.description : "",
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setValue("title", defaultValues.title);
      setValue("description", defaultValues.description);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [setValue, defaultValues.title, defaultValues.description]);

  const isCampaignChanged = (data) =>
    data.title !== defaultValues.title ||
    data.description !== defaultValues.description;

  const allActiveSubscribers =
    subscribers &&
    subscribers.filter(({ fields: { status } }) => status === "active");

  const confirmModalProps = {
    onConfirm: () => {
      if (
        !allActiveSubscribers.length &&
        pathname === `/campaigns/edit/${id}`
      ) {
        navigate("/subscribers/add");
      } else {
        navigate("/campaigns");
      }
    },
    onClose: () => setConfirmModalState({ isOpenConfirmModal: false }),
  };

  const setDataConfirmModal = (data, status) => {
    const styledTitle = (
      <span style={styles.title}>{capitalizeFirstLetter(data.title)}</span>
    );

    setConfirmModalState({
      confirmModalProps,
      isOpenConfirmModal: true,
    });
    setConfirmModalText({
      additionalText: !allActiveSubscribers.length
        ? "No active Subscribers!"
        : "",
      message:
        isCampaignChanged(data) && status === "sent" ? (
          <> Email {styledTitle} has been changed and finally sent 👋</>
        ) : !isCampaignChanged(data) && status === "draft" ? (
          <>
            Email {styledTitle} has not been changed and status still is draft
            😕
          </>
        ) : !isCampaignChanged(data) && status === "sent" ? (
          <>Email {styledTitle} has not been changed but finally sent 👋</>
        ) : isCampaignChanged(data) && status === "draft" ? (
          <>Email {styledTitle} has been changed and status still is draft 😕</>
        ) : (
          <>Email {styledTitle} has not been changed but finally sent 👋</>
        ),
      question: !allActiveSubscribers.length ? (
        <>
          Would you like to add a
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

  const updateEmailToAirtable = async (data, status) => {
    const { title, description } = data;

    try {
      const response = await api.put(`/campaigns/${id}`, {
        fields: {
          title,
          description,
          status,
        },
      });

      if (response) {
        setDataConfirmModal(response.fields, status);
      }
    } catch (error) {
      toastMessage(
        `Data were not been updated into Airtable:: ${error.message}`
      );
    }
  };

  const { mutateAsync: draftCampaign } = useMutation((data) =>
    updateEmailToAirtable(data, "draft")
  );

  const { mutateAsync: sendCampaign } = useMutation((data) =>
    sendEmailTo(
      data,
      finalSelectedActiveSubscribers.length
        ? finalSelectedActiveSubscribers
        : allActiveSubscribers,
      updateEmailToAirtable
    )
  );

  if (isLoading || isFetching) {
    return <Loader title="Get details" />;
  }

  return (
    <StyledContainer>
      <StyledHeading label="update email" />
      <StyledMainContent>
        <FormCampaign
          control={control}
          errors={errors}
          handleDraftData={handleSubmit(draftCampaign)}
          handleSendData={handleSubmit(sendCampaign)}
          disabledCheckbox={
            subscribers && !allActiveSubscribers.length ? true : false
          }
          labelCheckbox={
            subscribers
              ? `select from active subscribers (${allActiveSubscribers.length})`
              : "no active subscribers"
          }
        />
      </StyledMainContent>
    </StyledContainer>
  );
};

export default UpdateEmailsPage;
