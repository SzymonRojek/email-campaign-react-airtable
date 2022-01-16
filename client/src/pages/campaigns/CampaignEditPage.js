import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import emailjs from "emailjs-com";

import api from "api";
import { useFetchDetailsById } from "useFetchDetailsById";
import { capitalizeFirstLetter, validationCampaign } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { FormCampaign } from "components/FormCampaign";
import { StyledHeading } from "components/StyledHeading";
import { Loader, Error } from "components/DisplayMessage";

const {
  REACT_APP_EMAIL_SERVICE_ID,
  REACT_APP_EMAIL_TEMPLATE_ID,
  REACT_APP_EMAIL_USER_ID,
} = process.env;

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
    title: campaignData.data?.fields ? campaignData.data.fields.title : "",
    description: campaignData.data?.fields
      ? campaignData.data.fields.description
      : "",
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

    getCampaignsData();
  };

  const displayPopup = (data, status, changeRoute) => {
    const isCampaignChanged =
      data.title !== campaignData.data.fields.title ||
      data.description !== campaignData.data.fields.description;

    const campaignTitle = (
      <span style={status ? { color: "green" } : { color: "orange" }}>
        <strong> {capitalizeFirstLetter(data.title)} </strong>
      </span>
    );

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
  };

  const handleDraftCampaign = (data) => {
    if (
      data.title !== campaignData.data.fields.title ||
      data.description !== campaignData.data.fields.description
    ) {
      patchData(data, "draft");
    }

    displayPopup(data, false, navigate("/campaigns"));
    getCampaignsData();
  };

  const handleSendCampaign = (data) => {
    if (!data) return;

    if (subscribersData.data) {
      subscribersData.data
        .filter((subscriber) => subscriber.fields.status === "active")
        .forEach((subscriber) => {
          const paramsScheme = {
            name: subscriber.fields.name,
            email: subscriber.fields.email,
            title: data.title,
            description: data.description,
          };

          emailjs
            .send(
              REACT_APP_EMAIL_SERVICE_ID,
              REACT_APP_EMAIL_TEMPLATE_ID,
              paramsScheme,
              REACT_APP_EMAIL_USER_ID
            )
            .then(() => {
              setEmailError(false);
            })
            .catch((err) => {
              console.log("Unfortunately,", err);
              setEmailError(err);
            });
        });
    }

    if (!isEmailError) {
      patchData(data, "sent");
      displayPopup(data, true, navigate("/campaigns"));
      getCampaignsData();
    }
  };

  return (
    <>
      {isEmailError ? (
        <Error
          titleOne="Unfortunately, the Campaign has not been sent"
          titleTwo="Probably there is a problem with EmailJS application at the moment..."
          titleThree="That's why the Campaign has been drafted"
        />
      ) : campaignData.status === "loading" ? (
        <Loader title="Campaign Details" />
      ) : !Boolean(
          campaignsData.data &&
            campaignsData.data.find((item) => item.id === id)
        ) ? (
        <Error
          titleOne="Unfortunately, this Campaign does not exist"
          titleTwo="Check the url address"
          titleThree="Back to Campaigns"
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
