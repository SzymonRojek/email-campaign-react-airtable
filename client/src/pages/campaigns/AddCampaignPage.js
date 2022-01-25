import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import api from "api";
import { capitalizeFirstLetter, validationCampaign } from "helpers";
import { Loader, Error } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import { FormCampaign } from "components/FormCampaign";
import { sendEmail } from "../../sendEmail";

const postData = (data, status) =>
  api.post("/campaigns", {
    fields: {
      title: capitalizeFirstLetter(data.title),
      description: capitalizeFirstLetter(data.description),
      status: status,
    },
  });

const AddCampaignPage = ({
  subscribersData,
  getCampaignsData,
  setOpenInfoPopup,
  setContentPopup,
}) => {
  const {
    handleSubmit,
    control,
    formState,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationCampaign),
  });

  const [isEmailError, setEmailError] = useState(false);

  useEffect(() => {
    if (formState.isSubmitSuccessful)
      reset({
        title: "",
        description: "",
      });
  }, [formState, reset]);

  const displayPopup = (data, status, text = "") => {
    const styledTextPopup = status
      ? { color: "green", fontWeight: "bold" }
      : { color: "orange", fontWeight: "bold" };

    setContentPopup({
      title: (
        <span style={styledTextPopup}>{status ? "Sent!" : "Drafted!"} 🎊"</span>
      ),
      text: (
        <>
          Campaign
          <span style={styledTextPopup}>
            <strong> {capitalizeFirstLetter(data.title)} </strong>
          </span>
          has been {status ? "sent" : "drafted and added"} to the Airtable 😁
        </>
      ),
      additionalText: text,
      colorButton: "success",
    });

    setOpenInfoPopup(true);
  };

  const handleDraftCampaign = (data) => {
    postData(data, "draft");
    getCampaignsData();
    displayPopup(data, false);
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
      ? "There are no active subscribers at the moment - that's why email has been drafted"
      : "Email has been sent to active subscribers";

    console.log("active subscribers:", activeSubscribers);

    if (!isEmailError && activeSubscribers.length > 0) {
      postData(data, "sent");
      getCampaignsData();
      displayPopup(data, true, additionalText);
    } else {
      postData(data, "draft");
      getCampaignsData();
      displayPopup(data, false, additionalText);
    }
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
            handleSubmit={handleSubmit}
            handleDraftData={handleDraftCampaign}
            handleSendData={handleSendCampaign}
            control={control}
            errors={errors}
          />
        </StyledContainer>
      )}
    </>
  );
};

AddCampaignPage.propTypes = {
  subscribersData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  getCampaignsData: PropTypes.func.isRequired,
  setOpenInfoPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default AddCampaignPage;
