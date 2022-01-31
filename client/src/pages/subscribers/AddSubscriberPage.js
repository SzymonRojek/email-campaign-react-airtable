import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";

import api from "api";
import { capitalizeFirstLetter, validationSubscriber } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import { Loader, Error } from "components/DisplayMessage";

import { usePopup } from "popupContext";
import { FormSubscriber } from "components/FormSubscriber/";

const styles = {
  subscriberName: { color: "green" },
  questionSpan: { color: "crimson", fontWeight: "bold" },
};

const postData = (data) =>
  api.post("/subscribers", {
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

const AddSubscriberPage = ({ subscribersData, getSubscribersData }) => {
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
    postData(data);

    getSubscribersData();

    addTextPopup(setTextConfirmPopup(data));

    handleActionPopup(() => ({
      change: () =>
        location.pathname === "/subscribers/add"
          ? navigate("/subscribers")
          : "",
    }));

    openConfirmPopup();
  };

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

          <FormSubscriber
            control={control}
            errors={errors}
            handleSubmit={handleSubmit(onSubmit)}
            isCheckboxChecked={isCheckboxChecked}
          />
        </StyledContainer>
      )}
    </>
  );
};

AddSubscriberPage.propTypes = {
  getSubscribersData: PropTypes.func,
};

export default AddSubscriberPage;
