import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";

import api from "api";
import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { useConfirmModalState } from "contexts/ConfirmModalContext";
import { capitalizeFirstLetter, validationCampaign } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { FormCampaign } from "components/FormCampaign";

import { sendEmailJSonSuccess } from "sendEmail";

const styles = {
  questionSpan: { color: "crimson", fontWeight: "bold" },
  campaignName: { color: "green", fontWeight: "bold" },
};

const CreateEmailPage = () => {
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

  const { data: subscribers } = useQuery("subscribers", api.fetchItems);

  const allActiveSubscribers =
    subscribers &&
    subscribers.filter(({ fields: { status } }) => status === "active");

  const { finalSelectedActiveSubscribers } = useGlobalStoreContext();
  const { setConfirmModalState, setConfirmModalText } = useConfirmModalState();

  const [isEmailError, setEmailError] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const createAPIcampaign = async (data, status) =>
    await api
      .post("campaigns", {
        fields: {
          title: capitalizeFirstLetter(data.title),
          description: capitalizeFirstLetter(data.description),
          status,
        },
      })
      .then((response) => {
        setDataConfirmModal(response.fields, status);

        if (status === "sent")
          sendEmailJSonSuccess(
            response.fields,
            finalSelectedActiveSubscribers,
            allActiveSubscribers,
            setEmailError
          );
      });

  const { mutateAsync: draftCampaign } = useMutation((data) =>
    createAPIcampaign(data, "draft")
  );

  const { mutateAsync: sendCampaign } = useMutation((data) =>
    createAPIcampaign(data, "sent")
  );

  const confirmModalProps = {
    onConfirm: () => {
      if (!allActiveSubscribers.length && pathname === "/campaigns/add") {
        navigate("/subscribers/add");
      } else {
        navigate("/campaigns");
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
          {status
            ? "sent to choosen subscribers"
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

  useEffect(() => {
    if (formState.isSubmitSuccessful)
      reset({
        title: "",
        description: "",
      });
  }, [formState, reset]);

  return (
    <StyledContainer>
      <StyledHeading label="new email" />

      <StyledMainContent>
        <FormCampaign
          control={control}
          errors={errors}
          isCheckboxChecked={isCheckboxChecked}
          setIsCheckboxChecked={setIsCheckboxChecked}
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

export default CreateEmailPage;
