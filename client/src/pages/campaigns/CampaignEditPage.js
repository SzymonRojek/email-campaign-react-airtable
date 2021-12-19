import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { Container } from "@material-ui/core";
import emailjs from "emailjs-com";

import api from "api";
import { useFetchDetailsById } from "useFetchDetailsById";
import { capitalizeFirstLetter, validationCampaign } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { FormCampaign } from "components/FormCampaign";
import { StyledHeading } from "components/StyledHeading";
import { Loader, Error } from "components/DisplayMessage";

const { REACT_APP_MAIL_USER, REACT_APP_MAIL_TEMPLATE, REACT_APP_MAIL_KEY } =
  process.env;

const CampaignEditPage = ({
  campaignsData,
  subscribersData,
  getCampaignsData,
  setOpenInfoPopup,
  setContentPopup,
}) => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(validationCampaign),
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const endpoint = `/campaigns/${id}`;

  const { itemData: campaignData } = useFetchDetailsById(endpoint);
  const [isEmailError, setEmailError] = useState(false);

  const defaultValues = {
    title: campaignData.data ? campaignData.data.fields.title : "",
    description: campaignData.data ? campaignData.data.fields.description : "",
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setValue("title", defaultValues.title);
      setValue("description", defaultValues.description);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [setValue, defaultValues.title, defaultValues.description]);

  const patchData = (data, status) => {
    api.patch(endpoint, {
      fields: {
        title: capitalizeFirstLetter(data.title),
        description: capitalizeFirstLetter(data.description),
        status: status,
      },
    });
  };

  // check if Campaign's id is available, otherwise return Error
  let isIdCorrect = null;

  if (id !== undefined && campaignsData.data !== null) {
    isIdCorrect = Boolean(campaignsData.data.find((item) => item.id === id));
  }

  if (isIdCorrect === false || campaignData.status === "error") {
    return (
      <Error
        titleOne="Unfortunately, this Campaign does not exist."
        titleTwo="Check the url address."
        titleThree="Back to Subscribers."
      />
    );
  }

  const displayPopup = (data, status, changeRoute) => {
    const isCampaignChanged =
      data.title !== campaignData.data.fields.title ||
      data.description !== campaignData.data.fields.description;

    const campaignTitle = (
      <span style={status ? { color: "green" } : { color: "orange" }}>
        <strong> {capitalizeFirstLetter(data.title)} </strong>
      </span>
    );

    const addTimeout = () => {
      const timeoutId = setTimeout(() => {
        setOpenInfoPopup(false);

        changeRoute();
      }, 3_000);

      return () => clearTimeout(timeoutId);
    };

    setContentPopup({
      title: status ? (
        <span style={{ color: "green", fontWeight: "bold" }}>
          That's great 🎊
        </span>
      ) : (
        <span style={{ color: "orange", fontWeight: "bold" }}>
          Still draft... 🙂
        </span>
      ),
      text:
        isCampaignChanged && status ? (
          <> Campaign {campaignTitle} has been changed and finally sent 🙂</>
        ) : !isCampaignChanged && !status ? (
          <>
            Campaign {campaignTitle} has not been changed and status still is
            draft 🙂
          </>
        ) : !isCampaignChanged && status ? (
          <>Campaign {campaignTitle} has not been changed but finally sent 🙂</>
        ) : isCampaignChanged && !status ? (
          <>
            Campaign {campaignTitle} has been changed and status still is draft
            🙂
          </>
        ) : (
          <>Campaign {campaignTitle} has not been changed but finally sent 🙂</>
        ),
      colorButton: "success",
    });

    setOpenInfoPopup(true);

    addTimeout();
  };

  const handleDraftCampaign = (data) => {
    if (
      data.title !== campaignData.data.fields.title ||
      data.description !== campaignData.data.fields.description
    ) {
      patchData(data, "draft");

      getCampaignsData();
    }

    displayPopup(data, false, () => navigate("/campaigns"));
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
              "ereyeryery",
              REACT_APP_MAIL_TEMPLATE,
              inputsData,
              REACT_APP_MAIL_KEY
            )
            .then(() => {
              patchData(data, "sent");

              displayPopup(data, true, navigate("/campaigns"));

              getCampaignsData();
            })
            .catch((err) => {
              console.log("Unfortunately,", err);

              setEmailError(true);
            });
        });
    }
  };

  return (
    <>
      {isEmailError ? (
        <Error
          titleOne="Unfortunately, the Campaign has not been sent"
          titleTwo="Probably there is a problem with EmailJS application at the moment"
          titleThree="That's why the Campaign has been drafted"
        />
      ) : campaignData.status === "loading" ? (
        <Loader title="Campaign Details" />
      ) : campaignData.status === "error" ? (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Check the url address again."
          titleThree="Maybe there is no an access to the internet."
        />
      ) : (
        <StyledContainer>
          <StyledHeading label="Edit Campaign:" />

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

CampaignEditPage.propTypes = {
  campaignsData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  subscribersData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  getCampaignsData: PropTypes.func.isRequired,
  setOpenInfoPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default CampaignEditPage;
