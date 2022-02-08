import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import api from "api";
import { capitalizeFirstLetter, validationSubscriber } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { FormSubscriber } from "components/FormSubscriber/";
import { Loader, Error } from "components/DisplayMessage";
import { usePopup } from "popupContext";

import { useAPI } from "APiContextProvider";

const styles = {
  subscriberName: { color: "green" },
  questionSpan: { color: "crimson", fontWeight: "bold" },
};

const AddSubscriberPage = () => {
  const endpoint = "/subscribers";
  const { subscribersData, fetchSubscribersData } = useAPI();

  const {
    handleSubmit,
    watch,
    control,
    formState,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSubscriber),
  });

  const location = useLocation();
  const navigate = useNavigate();

  const { openConfirmPopup, handleActionPopup, addTextPopup } = usePopup();

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  useEffect(() => {
    const watchCheckbox = watch((value) =>
      setIsCheckboxChecked(value.checkbox)
    );

    return () => watchCheckbox.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({
        name: "",
        surname: "",
        profession: "",
        status: "select status",
        email: "",
        salary: "",
        telephone: "",
      });
    }
  }, [formState, reset]);

  const setTextConfirmPopup = (data) => ({
    title: (
      <>
        Subscriber
        <span style={styles.subscriberName}>
          <strong> {capitalizeFirstLetter(data.name)} </strong>
        </span>
        has been added to the list 😁
      </>
    ),
    question: (
      <>
        Would you like to come back to
        <span style={styles.questionSpan}> Subscribers List</span> ?
      </>
    ),
  });

  const onSubmit = (data) => {
    api.post(endpoint, {
      fields: {
        name: data.name,
        surname: data.surname,
        email: data.email,
        profession: data.profession,
        status: data.status,
        salary: data.salary,
        telephone: data.telephone,
      },
    });

    addTextPopup(setTextConfirmPopup(data));

    handleActionPopup(() => ({
      change: () =>
        location.pathname === "/subscribers/add"
          ? navigate("/subscribers")
          : "",
    }));

    openConfirmPopup();
  };

  if (formState.isSubmitSuccessful) {
    fetchSubscribersData();
  }

  return (
    <>
      {subscribersData.status === "loading" ? (
        <Loader title="Add New" />
      ) : subscribersData.status === "error" ? (
        <Error
          titleOne="ERROR MESSAGE"
          titleTwo="Probably there is no an access to the internet."
          titleThree="Contact with your internet provider."
        />
      ) : (
        <StyledContainer>
          <StyledHeading label="Add Subscriber" />
          <StyledMainContent>
            <FormSubscriber
              control={control}
              errors={errors}
              handleSubmit={handleSubmit(onSubmit)}
              isCheckboxChecked={isCheckboxChecked}
            />
          </StyledMainContent>
        </StyledContainer>
      )}
    </>
  );
};

AddSubscriberPage.propTypes = {
  getSubscribersData: PropTypes.func,
};

export default AddSubscriberPage;
