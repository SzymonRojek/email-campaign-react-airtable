import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { yupResolver } from "@hookform/resolvers/yup";

import { createSubscriber } from "services";
import { useConfirmModalState } from "contexts/ConfirmModalContext";
import { validationSubscriber } from "helpers";
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

  const handleConfirmModal = (data) => {
    setConfirmModalState({
      confirmModalProps,
      isOpenConfirmModal: true,
    });
    setConfirmModalText({
      message: (
        <>
          Subscriber
          <span style={styles.subscriberName}>
            <strong> {data.name} </strong>
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

  const { mutateAsync: createSubscriberAirtable } = useMutation((data) =>
    createSubscriber({ data, callback: handleConfirmModal })
  );

  return (
    <>
      <StyledContainer>
        <StyledHeading label="new subscriber" />
        <StyledMainContent>
          <FormSubscriber
            control={control}
            errors={errors}
            addSubscriber={handleSubmit(createSubscriberAirtable)}
            isCheckboxChecked={isCheckboxChecked}
            labelButton="add subscriber"
          />
        </StyledMainContent>
      </StyledContainer>
    </>
  );
};

export default CreateSubscriberPage;
