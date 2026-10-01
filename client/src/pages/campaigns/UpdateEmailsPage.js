import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "react-query";

import { fetchData, fetchDataById, updateEmail } from "services";
import { sendEmailTo } from "sendEmail";
import { useInformationModalState } from "contexts/InformationModalContext";
import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { validationCampaign, toastMessage } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { FormCampaign } from "components/FormCampaign";
import { StyledHeading } from "components/StyledHeading";
import { Loader, Error } from "components/DisplayMessage";

const UpdateEmailsPage = () => {
  const subscribersEndpoint = "/subscribers";
  const campaignsEndpoint = "/campaigns";
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(validationCampaign),
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: subscribers } = useQuery(subscribersEndpoint, fetchData);

  const {
    data: campaign,
    isLoading,
    isFetching,
    isError,
  } = useQuery([campaignsEndpoint, { id }], fetchDataById, {
    meta: {
      myMessage: "Campaign does not exist! ",
    },
  });

  const { finalSelectedActiveSubscribers } = useGlobalStoreContext();
  const { setInformationModalState, setInformationModalText } =
    useInformationModalState();

  const defaultValues = {
    title: campaign?.fields.title || "",
    description: campaign?.fields.description || "",
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setValue("title", defaultValues.title);
      setValue("description", defaultValues.description);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [setValue, defaultValues.title, defaultValues.description]);

  const allActiveSubscribers =
    (subscribers &&
      subscribers.filter(({ fields: { status } }) => status === "active")) ||
    [];

  const handleInformationModal = (data, status) => {
    setInformationModalText({
      title: status === "sent" ? <> That's great 🎊</> : <> Draft... 👋 </>,
      message:
        status === "sent" ? (
          <> Email {data.title} has been sent 👋 </>
        ) : (
          <> Email {data.title} is drafted 👋 </>
        ),
    });
    setInformationModalState({
      informationModalProps: {
        colorButton: "success",
        onClose: () => {
          setInformationModalState({ isOpenInformationModal: false });
          navigate(`${campaignsEndpoint}`);
        },
      },
      isOpenInformationModal: true,
    });
  };

  const { mutateAsync: draftCampaign } = useMutation((data) => {
    const config = {
      data,
      status: "draft",
      id,
      callback: handleInformationModal,
    };

    return updateEmail(config);
  });

  const { mutateAsync: sendCampaign } = useMutation((data) => {
    const receivers = finalSelectedActiveSubscribers ?? allActiveSubscribers;

    if (!receivers.length) {
      toastMessage("Please choose at least one subscriber");
      return Promise.resolve();
    }

    return sendEmailTo(data, receivers, () =>
      updateEmail({
        data,
        status: "sent",
        id,
        callback: handleInformationModal,
      })
    );
  });

  if (isLoading || isFetching) {
    return <Loader title="loading" />;
  }

  if (isError) {
    return <Error error="Email Campaign does not exist!" />;
  }

  return (
    <StyledContainer>
      <StyledHeading label="update email" />
      <StyledMainContent>
        <FormCampaign
          control={control}
          errors={errors}
          handleDraftData={handleSubmit(draftCampaign)}
          handleSendData={handleSubmit(sendCampaign)}
          disabledCheckbox={subscribers && !allActiveSubscribers.length}
          labelCheckbox={
            subscribers && !allActiveSubscribers.length
              ? "no active subscribers"
              : finalSelectedActiveSubscribers
              ? `selected subscribers: ${finalSelectedActiveSubscribers.length} from ${allActiveSubscribers.length}`
              : `active subscribers - ${allActiveSubscribers.length}`
          }
        />
      </StyledMainContent>
    </StyledContainer>
  );
};

export default UpdateEmailsPage;
