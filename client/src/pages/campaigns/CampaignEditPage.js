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
import { sendEmail } from "../../sendEmail";

const CampaignEditPage = ({
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
  const endpoint = "campaigns";
  const { itemData: campaignData } = useFetchDetailsById(endpoint, id);

  const defaultValues = {
    title: campaignData.data?.fields ? campaignData.data.fields.title : "",
    description: campaignData.data?.fields
      ? campaignData.data.fields.description
      : "",
  };

  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setValue("title", defaultValues.title);
      setValue("description", defaultValues.description);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [setValue, defaultValues.title, defaultValues.description]);

  const [isEmailError, setEmailError] = useState(false);

  const patchData = (data, status) =>
    api.patch(`${endpoint}/${id}`, {
      fields: {
        title: capitalizeFirstLetter(data.title),
        description: capitalizeFirstLetter(data.description),
        status: status,
      },
    });

  const displayPopup = (data, status, emailInfo) => {
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
      additionalText: emailInfo,
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
      ? "There are no active subscribers at the moment - that's why email has been drafted"
      : "Email has been sent to active subscribers";

    console.log("active subscribers:", activeSubscribers);

    if (!isEmailError && activeSubscribers.length > 0) {
      patchData(data, "sent");
      getCampaignsData();
      displayPopup(data, true, additionalText);
      navigate("/campaigns");
    } else {
      patchData(data, "draft");
      getCampaignsData();
      displayPopup(data, false, additionalText);
      navigate("/campaigns");
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
              handleSubmit={handleSubmit}
              handleDraftData={handleDraftCampaign}
              handleSendData={handleSendCampaign}
              control={control}
              errors={errors}
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
  setOpenInfoPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default CampaignEditPage;
