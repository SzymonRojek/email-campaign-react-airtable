import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";

import { updateEmail } from "services";
import { DEMO_EMAIL_NOTICE, sendEmailTo } from "sendEmail";
import { useCampaign, useSubscribers } from "customHooks/queries";
import { useInformationModalState } from "contexts/InformationModalContext";
import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { validationCampaign, toastMessage } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledMainContent } from "components/StyledMainContent";
import { FormCampaign } from "components/FormCampaign";
import { StyledHeading } from "components/StyledHeading";
import { Loader, Error } from "components/DisplayMessage";
import { CampaignFields, CampaignFormValues, CampaignStatus } from "types";

const UpdateEmailsPage = () => {
  const campaignsEndpoint = "/campaigns";
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<CampaignFormValues>({
    resolver: yupResolver(validationCampaign),
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: subscribers } = useSubscribers();

  const {
    data: campaign,
    isLoading,
    isFetching,
    isError,
  } = useCampaign(id, "Campaign does not exist! ");

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

  const handleInformationModal = (
    data: CampaignFields,
    status: CampaignStatus
  ) => {
    setInformationModalText({
      title: status === "sent" ? <> That's great 🎊</> : <> Draft... 👋 </>,
      additionalText: status === "sent" ? DEMO_EMAIL_NOTICE : "",
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

  const { mutateAsync: draftCampaign } = useMutation(
    (data: CampaignFormValues) =>
      updateEmail({
        data,
        status: "draft",
        id,
        callback: handleInformationModal,
      })
  );

  const { mutateAsync: sendCampaign } = useMutation(
    async (data: CampaignFormValues) => {
      const receivers = finalSelectedActiveSubscribers ?? allActiveSubscribers;

      if (!receivers.length) {
        toastMessage("Please choose at least one subscriber");
        return;
      }

      return sendEmailTo(data, receivers, () =>
        updateEmail({
          data,
          status: "sent",
          id,
          callback: handleInformationModal,
        })
      );
    }
  );

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
          handleDraftData={handleSubmit((data) => draftCampaign(data))}
          handleSendData={handleSubmit((data) => sendCampaign(data))}
          disabledCheckbox={Boolean(subscribers) && !allActiveSubscribers.length}
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
