import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from "react-router-dom";

import api from "api";
import { useAPIcontext } from "contexts/APIcontextProvider";
import { usePopupContext } from "contexts/popupContextProvider";
import { capitalizeFirstLetter, validationCampaign } from "helpers";
import { Loader, Error } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { FormCampaign } from "components/FormCampaign";
import { sendEmail } from "sendEmail";

const styles = {
  questionSpan: { color: "crimson", fontWeight: "bold" },
  campaignName: { color: "green", fontWeight: "bold" },
};

const CreateEmailPage = () => {
  const { subscribersData, fetchCampaignsData } = useAPIcontext();
  const {
    openConfirmPopup,
    addTextPopup,
    handleActionPopup,
    finalSelectedActiveSubscribers,
  } = usePopupContext();

  const {
    handleSubmit,
    control,
    formState,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationCampaign),
  });
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isEmailError, setEmailError] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const allActiveSubscribers =
    subscribersData.data &&
    subscribersData.data.filter(
      (subscriber) => subscriber.fields.status === "active"
    );

  useEffect(() => {
    if (formState.isSubmitSuccessful)
      reset({
        title: "",
        description: "",
      });
  }, [formState, reset]);

  const setTextConfirmPopup = (data, status) => ({
    additionalText: !allActiveSubscribers.length
      ? "No active Subscribers!"
      : "",
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

    handleActionPopup(() => ({
      change: () => {
        if (!allActiveSubscribers.length && pathname === "/campaigns/add") {
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
          <StyledHeading label="new email" />

          <StyledMainContent>
            <FormCampaign
              control={control}
              errors={errors}
              isCheckboxChecked={isCheckboxChecked}
              setIsCheckboxChecked={setIsCheckboxChecked}
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
      )}
    </>
  );
};

CreateEmailPage.propTypes = {
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

export default CreateEmailPage;
