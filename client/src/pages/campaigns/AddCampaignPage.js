import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";

import api from "api";
import { capitalizeFirstLetter, validationCampaign } from "helpers";
import { Loader, Error } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { FormCampaign } from "components/FormCampaign";
import { sendEmail } from "sendEmail";
import { usePopup } from "popupContext";
import { useAPI } from "APiContextProvider";

const styles = {
  questionSpan: { color: "crimson", fontWeight: "bold" },
  campaignName: { color: "green", fontWeight: "bold" },
};

const AddCampaignPage = () => {
  const { subscribersData, fetchCampaignsData } = useAPI();
  const {
    handleSubmit,
    control,
    formState,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationCampaign),
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { openConfirmPopup, addTextPopup, handleActionPopup, actionPopup } =
    usePopup();
  const [isEmailError, setEmailError] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  useEffect(() => {
    if (formState.isSubmitSuccessful)
      reset({
        title: "",
        description: "",
      });
  }, [formState, reset]);

  const setTextConfirmPopup = (data, status, addText = "") => ({
    additionalText: addText,
    title: (
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
    question: (
      <>
        Would you like to come back to
        <span style={styles.questionSpan}> the Campaigns List</span> ?
      </>
    ),
  });

  const getActionsOnSubmit = async (data, status) => {
    const response = await api.post("campaigns", {
      fields: {
        title: capitalizeFirstLetter(data.title),
        description: capitalizeFirstLetter(data.description),
        status: status,
      },
    });

    if (response) {
      fetchCampaignsData();
    }
  };

  const handleDraftCampaign = (data) => {
    getActionsOnSubmit(data, "draft");

    addTextPopup(setTextConfirmPopup(data, false));

    handleActionPopup(() => ({
      change: () =>
        location.pathname === "/campaigns/add" ? navigate("/campaigns") : "",
    }));
    openConfirmPopup();
  };

  const handleSendCampaign = (data) => {
    const allActiveSubscribers =
      subscribersData.data &&
      subscribersData.data.filter(
        (subscriber) => subscriber.fields.status === "active"
      );

    if (actionPopup.length) {
      actionPopup.map(({ fields: { name, email } }) =>
        sendEmail(
          {
            name,
            email,
            title: data.title,
            description: data.description,
          },
          setEmailError
        )
      );
    } else {
      allActiveSubscribers.forEach((subscriber) => {
        const paramsScheme = {
          name: subscriber.fields.name,
          email: subscriber.fields.email,
          title: data.title,
          description: data.description,
        };

        sendEmail(paramsScheme, setEmailError);
      });
    }

    const additionalText = !allActiveSubscribers.length
      ? "No active Subscribers!"
      : "";

    if (!isEmailError && allActiveSubscribers.length > 0) {
      getActionsOnSubmit(data, "sent");

      addTextPopup(setTextConfirmPopup(data, true, additionalText));

      openConfirmPopup();
    } else {
      getActionsOnSubmit(data, "draft");

      addTextPopup(setTextConfirmPopup(data, false, additionalText));

      openConfirmPopup();
    }
  };

  return (
    <>
      {isEmailError ? (
        <Error
          titleOne="Unfortunately, Email has not been sent"
          titleTwo="Probably there is a problem with EmailJS application at the moment"
          titleThree="That's why Email has been drafted now"
        />
      ) : subscribersData.status === "loading" ? (
        <Loader title="Add New" />
      ) : subscribersData.status === "error" ? (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Probably there is no an access to the internet."
          titleThree="Contact with your internet provider."
        />
      ) : (
        <StyledContainer>
          <StyledHeading label="send email" />
          <StyledMainContent
            style={{
              padding: "10px 50px 60px 50px",
              marginTop: 40,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(5px)",
              borderRadius: 6,
            }}
          >
            <FormCampaign
              control={control}
              errors={errors}
              isCheckboxChecked={isCheckboxChecked}
              setIsCheckboxChecked={setIsCheckboxChecked}
              handleDraftData={handleSubmit(handleDraftCampaign)}
              handleSendData={handleSubmit(handleSendCampaign)}
            />

            {/* <p>
            {actionPopup.length
              ? `You have selected ${actionPopup.length} subscribers`
              : "You will send an email to all active subscribers or select them from the list"}
          </p> */}
          </StyledMainContent>
        </StyledContainer>
      )}
    </>
  );
};

AddCampaignPage.propTypes = {
  subscribersData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        createdTime: PropTypes.string,
        fields: PropTypes.shape({
          status: PropTypes.string,
          name: PropTypes.string,
          surname: PropTypes.string,
          profession: PropTypes.string,
          email: PropTypes.string,
          salary: PropTypes.string,
          telephone: PropTypes.string,
        }),
      })
    ),
  }),
  getCampaignsData: PropTypes.func,
};

export default AddCampaignPage;
