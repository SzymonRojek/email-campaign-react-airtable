import PropTypes from "prop-types";
import { useEffect } from "react";
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

const styles = {
  subscriberName: { color: "green" },
  questionSpan: { color: "crimson", fontWeight: "bold" },
};

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

  const { openConfirmPopup, handleActionPopup, addTextPopup } = usePopup();

  const isCheckboxChecked = watch("checkbox", false);

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
    }, 1_000);

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

  // const setTextConfirmPopup = (data) => ({
  //   title: (
  //     <>
  //       Subscriber
  //       <span style={styles.subscriberName}>
  //         <strong> {capitalizeFirstLetter(data.name)} </strong>
  //       </span>
  //       has been added to the list 😁
  //     </>
  //   ),
  //   question: (
  //     <>
  //       Would you like to come back to
  //       <span style={styles.questionSpan}> Subscribers List</span> ?
  //     </>
  //   ),
  // });

  const onSubmit = (data) => {
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
    navigate("/subscribers");

    //   addTextPopup(setTextConfirmPopup(data));
    //   handleActionPopup(() => ({
    //     change: () =>
    //       location.pathname === "/subscribers/add"
    //         ? navigate("/subscribers")
    //         : "",
    //   }));
    //   openConfirmPopup();
    // };
  };

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

            // openConfirmPopup={openConfirmPopup}
            // addTextPopup={addTextPopup}
          />
        </StyledContainer>
      )}
    </>
  );
};

export default EditSubscriberPage;
