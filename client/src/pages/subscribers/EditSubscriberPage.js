import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";

import api from "api";
import { useFetchDetailsById } from "useFetchDetailsById";
import { validationSubscriber } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import { Loader, Error } from "components/DisplayMessage";

import { usePopup } from "popupContext";
import { FormSubscriber } from "components/FormSubscriber/";

const EditSubscriberPage = ({ getSubscribersData }) => {
  const {
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSubscriber),
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const endpoint = "subscribers";
  const { itemData: subscriberData } = useFetchDetailsById(endpoint, id);

  const { openInfoPopup, addTextPopup } = usePopup();

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  useEffect(() => {
    const watchCheckbox = watch((value) =>
      setIsCheckboxChecked(value.checkbox)
    );

    return () => watchCheckbox.unsubscribe();
  }, [watch]);

  const defaultValues = {
    name: subscriberData.data?.fields ? subscriberData.data.fields.name : "",
    surname: subscriberData.data?.fields
      ? subscriberData.data.fields.surname
      : "",
    email: subscriberData.data?.fields ? subscriberData.data.fields.email : "",
    status: subscriberData.data?.fields
      ? subscriberData.data.fields.status
      : "",
    profession: subscriberData.data?.fields
      ? subscriberData.data.fields.profession
      : "",
    salary: subscriberData.data?.fields
      ? subscriberData.data.fields.salary
      : "",
    telephone: subscriberData.data?.fields
      ? subscriberData.data.fields.telephone
      : "",
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setValue("name", defaultValues.name);
      setValue("surname", defaultValues.surname);
      setValue("email", defaultValues.email);
      setValue("status", defaultValues.status);
      setValue("profession", defaultValues.profession);
      setValue("salary", defaultValues.salary);
      setValue("telephone", defaultValues.telephone);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [
    setValue,
    defaultValues.name,
    defaultValues.surname,
    defaultValues.email,
    defaultValues.status,
    defaultValues.profession,
    defaultValues.salary,
    defaultValues.telephone,
  ]);

  const isSubscriberDataEdited = (data) =>
    data.name !== defaultValues.name ||
    data.surname !== defaultValues.surname ||
    data.email !== defaultValues.email ||
    data.status !== defaultValues.status ||
    data.profession !== defaultValues.profession ||
    data.salary !== defaultValues.salary ||
    data.telephone !== defaultValues.telephone;

  const displayPopup = (data) => {
    const styles = {
      noChange: { color: "orange", fontWeight: "bold", letterSpacing: 2 },
      change: { color: "green", fontWeight: "bold", letterSpacing: 2 },
      name: { color: "green", fontWeight: "bold", letterSpacing: 2 },
    };

    addTextPopup({
      title: isSubscriberDataEdited(data) ? (
        <span style={styles.change}>That's great 🎊</span>
      ) : (
        <span style={styles.noChange}>No changes... 👋</span>
      ),
      mainText: isSubscriberDataEdited(data) ? (
        <>
          Subscriber <span style={styles.name}>{defaultValues.name}</span> has
          been edited 👋
        </>
      ) : (
        <>
          Subscriber <span style={styles.name}>{defaultValues.name}</span> has
          not been edited 😕
        </>
      ),

      colorButton: "success",
    });

    openInfoPopup();
  };

  const onSubmit = (data) => {
    if (isSubscriberDataEdited(data)) {
      api.patch(`${endpoint}/${id}`, {
        fields: {
          name: data.name,
          surname: data.surname,
          email: data.email,
          profession: data.profession,
          status: data.status,
          salary: String(data.salary),
          telephone: data.telephone,
        },
      });
      getSubscribersData();
    }

    navigate("/subscribers");
    displayPopup(data);
  };

  if (subscriberData.data?.error) {
    return (
      <Error
        titleOne={`${subscriberData.data?.error.messageOne}`}
        titleTwo={`${subscriberData.data?.error.messageTwo}`}
      />
    );
  }

  return (
    <>
      {subscriberData.status === "loading" ? (
        <Loader title="Edit Data" />
      ) : subscriberData.status === "error" ? (
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

export default EditSubscriberPage;
