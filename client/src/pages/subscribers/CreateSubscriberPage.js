import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";

import api from "api";
import { useConfirmModalState } from "contexts/ConfirmModalContext";
import {
  capitalizeFirstLetter,
  validationSubscriber,
  toastMessage,
} from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { FormSubscriber } from "components/FormSubscriber/";

const styles = {
  subscriberName: { color: "green" },
  questionSpan: { color: "crimson", fontWeight: "bold" },
};

const CreateSubscriberPage = () => {
  const endpoint = "/subscribers";
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

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { setConfirmModalState, setConfirmModalText } = useConfirmModalState();

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
        email: "",
        status: "select status",
        profession: "",
        salary: "",
        telephone: "",
      });
    }
  }, [formState, reset]);

  const confirmModalProps = {
    onConfirm: () =>
      pathname === `${endpoint}/add` ? navigate(`${endpoint}`) : "",
    onClose: () => setConfirmModalState({ isOpenConfirmModal: false }),
  };

  const setDataConfirmModal = (data) => {
    setConfirmModalState({
      confirmModalProps,
      isOpenConfirmModal: true,
    });
    setConfirmModalText({
      message: (
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
  };

  const createAPISubscriber = async (data) => {
    const postData = {
      fields: {
        name: capitalizeFirstLetter(data.name),
        surname: capitalizeFirstLetter(data.surname),
        email: data.email,
        status: data.status,
        profession: data.profession,
        salary: data.salary,
        telephone: data.telephone,
      },
    };

    try {
      const response = await api.post(`${endpoint}`, postData);

      setDataConfirmModal(response.fields);
    } catch (error) {
      toastMessage(`Data were not been sent to the Airtable: ${error.message}`);
    }
  };

  const { mutateAsync: createSubscriber } = useMutation(createAPISubscriber);

  return (
    <>
      <StyledContainer>
        <StyledHeading label="new subscriber" />
        <StyledMainContent>
          <FormSubscriber
            control={control}
            errors={errors}
            addSubscriber={handleSubmit(createSubscriber)}
            isCheckboxChecked={isCheckboxChecked}
            labelButton="add subscriber"
          />
        </StyledMainContent>
      </StyledContainer>
    </>
  );
};

export default CreateSubscriberPage;
