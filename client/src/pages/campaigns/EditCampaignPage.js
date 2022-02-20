import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router";

import api from "api";
import { useAPIcontext } from "contexts/APIcontextProvider";
import { usePopupContext } from "contexts/popupContextProvider";
import { useFetchDetailsById } from "useFetchDetailsById";
import { capitalizeFirstLetter, validationCampaign } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { FormCampaign } from "components/FormCampaign";
import { StyledHeading } from "components/StyledHeading";
import { Loader, Error } from "components/DisplayMessage";
import { sendEmail } from "sendEmail";

const styles = {
  questionSpan: { color: "crimson", fontWeight: "bold" },
  campaignName: { color: "green", fontWeight: "bold" },
};

const EditCampaignPage = () => {
  const { subscribersData, fetchCampaignsData } = useAPIcontext();
  const {
    openConfirmPopup,
    addTextPopup,
    handleActionPopup,
    finalSelectedActiveSubscribers,
  } = usePopupContext();

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
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const endpoint = "campaigns";
  const { itemData: campaignData } = useFetchDetailsById(endpoint, id);

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
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [setValue, defaultValues.title, defaultValues.description]);

  const isCampaignChanged = (data) =>
    data.title !== defaultValues.title ||
    data.description !== defaultValues.description;

  const allActiveSubscribers =
    subscribersData.data &&
    subscribersData.data.filter(
      (subscriber) => subscriber.fields.status === "active"
    );

  const styledCampaignTitle = (data) => (
    <span style={styles.title}>{capitalizeFirstLetter(data.title)}</span>
  );

  const setTextConfirmPopup = (data, status) => ({
    additionalText: !allActiveSubscribers.length
      ? "No active Subscribers!"
      : "",
    title:
      isCampaignChanged(data) && status ? (
        <>
          {" "}
          Email {styledCampaignTitle(data)} has been changed and finally sent 👋
        </>
      ) : !isCampaignChanged(data) && !status ? (
        <>
          Email {styledCampaignTitle(data)} has not been changed and status
          still is draft 😕
        </>
      ) : !isCampaignChanged(data) && status ? (
        <>
          Email {styledCampaignTitle(data)} has not been changed but finally
          sent 👋
        </>
      ) : isCampaignChanged(data) && !status ? (
        <>
          Email {styledCampaignTitle(data)} has been changed and status still is
          draft 😕
        </>
      ) : (
        <>
          Email {styledCampaignTitle(data)} has not been changed but finally
          sent 👋
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

  const getActionsOnSubmit = async (data, status) => {
    const response = await api.patch(`${endpoint}/${id}`, {
      fields: {
        title: data.title,
        description: data.description,
        status: status,
      },
    });

    if (response) {
      await fetchCampaignsData();
    }

    handleActionPopup(() => ({
      change: () => {
        if (
          !allActiveSubscribers.length &&
          pathname === `/campaigns/edit/${id}`
        ) {
          navigate("/subscribers/add");
        } else {
          navigate("/campaigns");
        }
      },
    }));
  };

  const handleDraftCampaign = (data) => {
    getActionsOnSubmit(data, "draft");

    addTextPopup(setTextConfirmPopup(data, false));

    openConfirmPopup();
  };

  const handleSendCampaign = (data) => {
    if (finalSelectedActiveSubscribers.length) {
      finalSelectedActiveSubscribers.map(({ fields: { name, email } }) =>
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

    if (!isEmailError && allActiveSubscribers.length > 0) {
      getActionsOnSubmit(data, "sent");

      addTextPopup(setTextConfirmPopup(data, true));

      openConfirmPopup();
    } else {
      getActionsOnSubmit(data, "draft");

      addTextPopup(setTextConfirmPopup(data, false));

      openConfirmPopup();
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
          titleOne="Unfortunately, Email has not been sent"
          titleTwo="Probably there is a problem with EmailJS application at the moment..."
          titleThree="That's why Email has been drafted"
        />
      ) : campaignData.status === "loading" ? (
        <Loader title="Details" />
      ) : (
        campaignData.status === "success" && (
          <StyledContainer>
            <StyledHeading label="edit email" />
            <StyledMainContent>
              <FormCampaign
                control={control}
                errors={errors}
                handleSubmit={handleSubmit}
                handleDraftData={handleSubmit(handleDraftCampaign)}
                handleSendData={handleSubmit(handleSendCampaign)}
                disabledCheckbox={!allActiveSubscribers.length ? true : false}
                labelCheckbox={
                  !allActiveSubscribers.length
                    ? "no active subscribers"
                    : `select from active subscribers (${allActiveSubscribers.length})`
                }
              />
            </StyledMainContent>
          </StyledContainer>
        )
      )}
    </>
  );
};

EditCampaignPage.propTypes = {
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

export default EditCampaignPage;
