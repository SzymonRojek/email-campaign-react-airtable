import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";

import api from "api";
import { useAPIcontext } from "contexts/APIcontextProvider";
import { useFetchDetailsById } from "customHooks/useFetchDetailsById";
import { validationSubscriber } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { StyledHeading } from "components/StyledHeading";
import { Loader } from "components/DisplayMessage";
import { FormSubscriber } from "components/FormSubscriber/";
import { useInformationModalState } from "../../contexts/InformationModalContext";

const UpdateSubscriberPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const { fetchSubscribersData } = useAPIcontext();

  const { setInformationModalState, setInformationModalText } =
    useInformationModalState();

  const { itemData: subscriberData } = useFetchDetailsById(endpoint, id);

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const defaultValues = {
    name: subscriberData.data ? subscriberData.data.fields.name : "",
    surname: subscriberData.data ? subscriberData.data.fields.surname : "",
    email: subscriberData.data ? subscriberData.data.fields.email : "",
    status: subscriberData.data ? subscriberData.data.fields.status : "",
    profession: subscriberData.data
      ? subscriberData.data.fields.profession
      : "",
    salary: subscriberData.data ? subscriberData.data.fields.salary : "",
    telephone: subscriberData.data ? subscriberData.data.fields.telephone : "",
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
      navigate("/subscribers");
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

  const getActionsOnSubmit = async (data) => {
    const response = await api.patch(`${endpoint}/${id}`, {
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

    if (response) {
      await fetchSubscribersData();
    }
  };

  const onSubmit = async (data) => {
    getActionsOnSubmit(data);
    handleInformationModal(data);
  };

  // if (subscriberData.data?.error) {
  //   return (
  //     <Error
  //       titleOne={`${subscriberData.data?.error.messageOne}`}
  //       titleTwo={`${subscriberData.data?.error.messageTwo}`}
  //     />
  //   );
  // }

  return (
    <>
      {subscriberData.status === "loading" ? (
        <Loader title="Getting data" />
      ) : (
        <StyledContainer>
          <StyledHeading label="edit subscriber" />
          <StyledMainContent>
            <FormSubscriber
              control={control}
              errors={errors}
              addSubscriber={handleSubmit(onSubmit)}
              isCheckboxChecked={isCheckboxChecked}
              labelButton="update subscriber"
            />
          </StyledMainContent>
        </StyledContainer>
      )}
    </>
  );
};

export default UpdateSubscriberPage;
