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

  const { REACT_APP_MAIL_USER, REACT_APP_MAIL_TEMPLATE, REACT_APP_MAIL_KEY } =
    process.env;

  useEffect(() => {
    if (formState.isSubmitSuccessful)
      reset({
        title: "",
        description: "",
      });
  }, [formState, reset]);

  const [isEmailError, setEmailError] = useState(false);

  const endpoint = "/campaigns";

  const displayPopup = (data, status) => {
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
      colorButton: "success",
    });

    setOpenInfoPopup(true);

    setTimeout(() => {
      setOpenInfoPopup(false);
    }, 3_000);
  };

  const handleDraftCampaign = (data) => {
    api.post(endpoint, {
      fields: {
        title: capitalizeFirstLetter(data.title),
        description: capitalizeFirstLetter(data.description),
        status: "draft",
      },
    });
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
              api.post(endpoint, {
                fields: {
                  title: capitalizeFirstLetter(data.title),
                  description: capitalizeFirstLetter(data.description),
                  status: "sent",
                },
              });
              displayPopup(data, true);
            })
            .catch((err) => {
              console.log("Unfortunately,", err);
              api.post(endpoint, {
                fields: {
                  title: capitalizeFirstLetter(data.title),
                  description: capitalizeFirstLetter(data.description),
                  status: "draft",
                },
              });
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
          titleThree="That's why your Campaign has been drafted"
        />
      ) : (
        <Container>
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
  isCalledRefCampaigns: PropTypes.shape({
    current: PropTypes.bool.isRequired,
  }),
  setOpenInfoPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default AddCampaignPage;
