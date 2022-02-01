import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";

import api from "api";
import { capitalizeFirstLetter, validationCampaign } from "helpers";
import { Loader, Error } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import { FormCampaign } from "components/FormCampaign";
import { sendEmail } from "sendEmail";
import { usePopup } from "popupContext";

const styles = {
  questionSpan: { color: "crimson", fontWeight: "bold" },
  campaignName: { color: "green", fontWeight: "bold" },
};

const postData = (data, status) =>
  api.post("campaigns", {
    fields: {
      title: capitalizeFirstLetter(data.title),
      description: capitalizeFirstLetter(data.description),
      status: status,
    },
  });

const AddCampaignPage = ({ subscribersData, getCampaignsData }) => {
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
  const { openConfirmPopup, addTextPopup, handleActionPopup } = usePopup();
  const [isEmailError, setEmailError] = useState(false);

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
        has been {status ? "sent" : "drafted and added"} to active subscribers
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

  const handleDraftCampaign = (data) => {
    postData(data, "draft");
    getCampaignsData();
    addTextPopup(setTextConfirmPopup(data, false));
    handleActionPopup(() => ({
      change: () =>
        location.pathname === "/campaigns/add" ? navigate("/campaigns") : "",
    }));
    openConfirmPopup();
  };

  const handleSendCampaign = (data) => {
    const activeSubscribers =
      subscribersData.data &&
      subscribersData.data.filter(
        (subscriber) => subscriber.fields.status === "active"
      );

    activeSubscribers.forEach((subscriber) => {
      const paramsScheme = {
        name: subscriber.fields.name,
        email: subscriber.fields.email,
        title: data.title,
        description: data.description,
      };

      sendEmail(paramsScheme, setEmailError);
    });

    const additionalText = !activeSubscribers.length
      ? "No active Subscribers!"
      : "";

    console.log("active subscribers:", activeSubscribers);

    if (!isEmailError && activeSubscribers.length > 0) {
      postData(data, "sent");
      addTextPopup(setTextConfirmPopup(data, true, additionalText));
      openConfirmPopup();
    } else {
      postData(data, "draft");
      addTextPopup(setTextConfirmPopup(data, false, additionalText));
      openConfirmPopup();
    }

    getCampaignsData();
  };

  return (
    <>
      {isEmailError ? (
        <Error
          titleOne="Unfortunately, the Campaign has not been sent"
          titleTwo="Probably there is a problem with EmailJS application at the moment"
          titleThree="That's why the Campaign has been drafted now"
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
        <StyledContainer
          style={{
            padding: "10px 50px 60px 50px",
            marginTop: 40,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(5px)",
            borderRadius: 6,
          }}
        >
          <StyledHeading label="Add Campaign:" />

          <FormCampaign
            control={control}
            errors={errors}
            handleSubmit={handleSubmit}
            handleDraftData={handleDraftCampaign}
            handleSendData={handleSendCampaign}
          />
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
