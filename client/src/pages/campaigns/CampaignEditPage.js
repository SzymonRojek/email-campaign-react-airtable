import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";

import api from "api";
import { useFetchDetailsById } from "useFetchDetailsById";
import { capitalizeFirstLetter, validationCampaign } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { FormCampaign } from "components/FormCampaign";
import { StyledHeading } from "components/StyledHeading";
import { Loader, Error } from "components/DisplayMessage";
import { sendEmail } from "sendEmail";
import { usePopup } from "popupContext";

const CampaignEditPage = ({ subscribersData, getCampaignsData }) => {
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(validationCampaign),
  });
  const [isEmailError, setEmailError] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { openInfoPopup, addTextPopup } = usePopup();

  const endpoint = "campaigns";
  const { itemData: campaignData } = useFetchDetailsById(endpoint, id);

  const { title, description } = campaignData.data
    ? campaignData.data.fields
    : "";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setValue("title", title);
      setValue("description", description);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [setValue, title, description]);

  const patchData = (data, status) =>
    api.patch(`${endpoint}/${id}`, {
      fields: {
        title: capitalizeFirstLetter(data.title),
        description: capitalizeFirstLetter(data.description),
        status: status,
      },
    });

  const isCampaignChanged = (data) =>
    data.title !== title || data.description !== description;

  const displayPopup = (data, status, additionalText) => {
    const styles = {
      sent: { color: "green", fontWeight: "bold", letterSpacing: 2 },
      draft: { color: "orange", fontWeight: "bold", letterSpacing: 2 },
      title: { color: "green", fontWeight: "bold", letterSpacing: 2 },
    };

    const campaignTitle = (
      <span style={styles.title}>{capitalizeFirstLetter(data.title)}</span>
    );

    addTextPopup({
      title: status ? (
        <span style={styles.sent}>That's great 🎊</span>
      ) : (
        <span style={styles.draft}>Still draft... 🙂</span>
      ),
      mainText:
        isCampaignChanged(data) && status ? (
          <> Email {campaignTitle} has been changed and finally sent 👋</>
        ) : !isCampaignChanged(data) && !status ? (
          <>
            Email {campaignTitle} has not been changed and status still is draft
            😕
          </>
        ) : !isCampaignChanged(data) && status ? (
          <>Email {campaignTitle} has not been changed but finally sent 👋</>
        ) : isCampaignChanged(data) && !status ? (
          <>
            Email {campaignTitle} has been changed and status still is draft 😕
          </>
        ) : (
          <>Email {campaignTitle} has not been changed but finally sent 👋</>
        ),
      additionalText,
      colorButton: "success",
    });

    openInfoPopup();
  };

  const handleDraftCampaign = (data) => {
    if (isCampaignChanged(data)) {
      patchData(data, "draft");
      getCampaignsData();
    }

    displayPopup(data, false, navigate("/campaigns"));
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
      patchData(data, "sent");
      getCampaignsData();
      displayPopup(data, true, additionalText, navigate("/campaigns"));
    } else {
      patchData(data, "draft");
      getCampaignsData();
      displayPopup(data, false, additionalText, navigate("/campaigns"));
    }
  };

  if (campaignData.data?.error) {
    return (
      <Error
        titleOne={`${campaignData.data?.error.messageOne}`}
        titleTwo={`${campaignData.data?.error.messageTwo}`}
      />
    );
  }

  return (
    <>
      {isEmailError ? (
        <Error
          titleOne="Unfortunately, the Campaign has not been sent"
          titleTwo="Probably there is a problem with EmailJS application at the moment..."
          titleThree="That's why the Campaign has been drafted"
        />
      ) : campaignData.status === "loading" ? (
        <Loader title="Details" />
      ) : (
        campaignData.status === "success" && (
          <StyledContainer>
            <StyledHeading label="Edit Campaign:" />

            <FormCampaign
              control={control}
              errors={errors}
              handleSubmit={handleSubmit}
              handleDraftData={handleDraftCampaign}
              handleSendData={handleSendCampaign}
            />
          </StyledContainer>
        )
      )}
    </>
  );
};

CampaignEditPage.propTypes = {
  subscribersData: PropTypes.shape({
    status: PropTypes.string,
    data: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  getCampaignsData: PropTypes.func.isRequired,
};

export default CampaignEditPage;
