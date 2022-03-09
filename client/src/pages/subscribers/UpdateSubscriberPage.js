import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";

import api from "api";
import { useInformationModalState } from "contexts/InformationModalContext";
import { validationSubscriber } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { Loader } from "components/DisplayMessage";
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
  } = useQuery(["subscribers", { id }], api.fetchDetailsItemById, {
    meta: {
      myMessage: "Subscriber does not exist! ",
    },
  });

  const { setInformationModalState, setInformationModalText } =
    useInformationModalState();

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const defaultValues = {
    name: subscriber ? subscriber.fields.name : "",
    surname: subscriber ? subscriber.fields.surname : "",
    email: subscriber ? subscriber.fields.email : "",
    status: subscriber ? subscriber.fields.status : "",
    profession: subscriber ? subscriber.fields.profession : "",
    salary: subscriber ? subscriber.fields.salary : "",
    telephone: subscriber ? subscriber.fields.telephone : "",
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
      title: isSubscriberDataEdited(data) ? (
        <span style={styles.change}>That's great 🎊</span>
      ) : (
        <span style={styles.noChange}>No changes... 👋</span>
      ),
      message: isSubscriberDataEdited(data) ? (
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

    await api
      .put(`${endpoint}/${id}`, {
        fields: {
          name,
          surname,
          email,
          profession,
          status,
          salary,
          telephone,
        },
      })
      .then((response) => {
        handleInformationModal(response.fields);
      });
  };

  const { mutateAsync: updateSubscriber } = useMutation(updateAPIsubscriber);

  if (isLoading || isFetching) {
    return <Loader title="Getting data" />;
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
