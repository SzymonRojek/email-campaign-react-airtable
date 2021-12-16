import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Container } from "@material-ui/core";
import emailjs from "emailjs-com";

import api from "api";
import { capitalizeFirstLetter, validationCampaign } from "helpers";
import { FormCampaign } from "components/FormCampaign";
import { StyledHeading } from "components/StyledHeading";
import { Error } from "components/DisplayMessage";

const { REACT_APP_MAIL_USER, REACT_APP_MAIL_TEMPLATE, REACT_APP_MAIL_KEY } =
  process.env;

const postData = (data, status) => {
  const endpoint = "/campaigns";

  api.post(endpoint, {
    fields: {
      title: capitalizeFirstLetter(data.title),
      description: capitalizeFirstLetter(data.description),
      status: status,
    },
  });
};

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

  const displayPopup = (data, status) => {
    const styledTextPopup = status
      ? { color: "green", fontWeight: "bold" }
      : { color: "orange", fontWeight: "bold" };

    const addTimeout = () => {
      const timeoutId = setTimeout(() => {
        setOpenInfoPopup(false);
      }, 3_000);

      return () => clearTimeout(timeoutId);
    };

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
      colorButton: "success",
    });

    addTimeout();
    setOpenInfoPopup(true);
  };

  const handleDraftCampaign = (data) => {
    postData(data, "draft");
    getCampaignsData();
    displayPopup(data, false);
  };

  const handleSendCampaign = (data) => {
    if (subscribersData.data) {
      subscribersData.data
        .filter((subscriber) => subscriber.fields.status === "active")
        .forEach((subscriber) => {
          const inputsData = {
            name: subscriber.fields.name,
            email: subscriber.fields.email,
            title: data.title,
            description: data.description,
          };
          // REACT_APP_MAIL_USER,
          emailjs
            .send(
              "sgswdgsdg",
              REACT_APP_MAIL_TEMPLATE,
              inputsData,
              REACT_APP_MAIL_KEY
            )
            .then(() => {
              postData(data, "sent");
              displayPopup(data, true);
            })
            .catch((err) => {
              console.log("Unfortunately,", err);
              postData(data, "draft");
              setEmailError(true);
              displayPopup(data, false);
            });
        });
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
      ) : (
        <Container
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
        </Container>
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