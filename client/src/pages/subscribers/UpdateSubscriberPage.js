import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";

import api from "api";
import { useInformationModalState } from "contexts/InformationModalContext";
import { validationSubscriber, toastMessage } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { Loader, Error } from "components/DisplayMessage";
import { FormSubscriber } from "components/FormSubscriber/";

const UpdateSubscriberPage = () => {
  const endpoint = "/subscribers";
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

  const {
    data: subscriber,
    isLoading,
    isFetching,
    isError,
  } = useQuery([endpoint, { id }], api.fetchDetailsItemById, {
    meta: {
      myMessage: "Subscriber does not exist! ",
    },
  });

  const { setInformationModalState, setInformationModalText } =
    useInformationModalState();

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const defaultValues = {
    name: subscriber?.fields.name || "",
    email: subscriber?.fields.email || "",
    surname: subscriber?.fields.surname || "",
    status: subscriber?.fields.status || "",
    salary: subscriber?.fields.salary || "",
    telephone: subscriber?.fields.telephone || "",
    profession: subscriber?.fields.profession || "",
  };

  useEffect(() => {
    const watchCheckbox = watch((value) =>
      setIsCheckboxChecked(value.checkbox)
    );
    return () => watchCheckbox.unsubscribe();
  }, [watch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setValue("name", defaultValues.name);
      setValue("email", defaultValues.email);
      setValue("surname", defaultValues.surname);
      setValue("status", defaultValues.status);
      setValue("salary", defaultValues.salary);
      setValue("telephone", defaultValues.telephone);
      setValue("profession", defaultValues.profession);
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

  const isSubscriberDataEdited = (data, defaultValues) =>
    JSON.stringify(data) === JSON.stringify(defaultValues);

  const informationModalProps = {
    colorButton: "success",
    onClose: () => {
      setInformationModalState({ isOpenInformationModal: false });
      navigate(`${endpoint}`);
    },
  };

  const handleInformationModal = (data) => {
    const styles = {
      noChange: { color: "orange", fontWeight: "bold", letterSpacing: 2 },
      change: { color: "green", fontWeight: "bold", letterSpacing: 2 },
      name: { color: "green", fontWeight: "bold", letterSpacing: 2 },
    };

    setInformationModalText({
      title: !isSubscriberDataEdited(data, defaultValues) ? (
        <span style={styles.change}>That's great 🎊</span>
      ) : (
        <span style={styles.noChange}>No changes... 👋</span>
      ),
      message: !isSubscriberDataEdited(data, defaultValues) ? (
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
    });
    setInformationModalState({
      informationModalProps,
      isOpenInformationModal: true,
    });
  };

  const updateAPIsubscriber = async (data) => {
    const { name, surname, email, profession, status, salary, telephone } =
      data;

    const patchData = {
      fields: {
        name,
        email,
        surname,
        status,
        salary,
        telephone,
        profession,
      },
    };

    try {
      const response = await api.patch(`${endpoint}/${id}`, patchData);

      handleInformationModal(response.fields);
    } catch (error) {
      toastMessage(
        `Data were not been updated into Airtable: ${error.message}`
      );
    }
  };

  const { mutateAsync: updateSubscriber } = useMutation(updateAPIsubscriber);

  if (isLoading || isFetching) {
    return <Loader title="Getting data" />;
  }

  if (isError) {
    return <Error error="Subscriber does not exist!" />;
  }

  return (
    <StyledContainer>
      <StyledHeading label="update subscriber" />
      <StyledMainContent>
        <FormSubscriber
          control={control}
          errors={errors}
          addSubscriber={handleSubmit(updateSubscriber)}
          isCheckboxChecked={isCheckboxChecked}
          labelButton="update subscriber"
        />
      </StyledMainContent>
    </StyledContainer>
  );
};

export default UpdateSubscriberPage;
