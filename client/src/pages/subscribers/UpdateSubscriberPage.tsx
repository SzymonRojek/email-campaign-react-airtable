import { useNavigate, useParams } from "react-router-dom";

import { updateSubscriber } from "services";
import { useSubscriber } from "customHooks/queries";
import { useInformationModalState } from "contexts/InformationModalContext";
import { Error, Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import SubscriberForm from "components/subscribers/SubscriberForm";
import { SubscriberFields } from "types";

const UpdateSubscriberPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: subscriber, isLoading, isError } = useSubscriber(
    id,
    "Subscriber does not exist! "
  );
  const { setInformationModalState, setInformationModalText } =
    useInformationModalState();

  const handleUpdated = (updated: SubscriberFields) => {
    setInformationModalText({
      title: "That's great 🎊",
      message: `Subscriber ${updated.name} has been edited 👋`,
    });
    setInformationModalState({
      isOpenInformationModal: true,
      informationModalProps: {
        colorButton: "success",
        onClose: () => {
          setInformationModalState({ isOpenInformationModal: false });
          navigate("/subscribers");
        },
      },
    });
  };

  if (isLoading) return <Loader />;
  if (isError || !subscriber) return <Error error="Subscriber does not exist!" />;

  const { fields } = subscriber;

  return (
    <StyledContainer>
      <StyledHeading label="update subscriber" />
      {/* the form gets the loaded data as its starting values */}
      <SubscriberForm
        defaultValues={{
          name: fields.name ?? "",
          surname: fields.surname ?? "",
          email: fields.email ?? "",
          status: fields.status,
          profession: fields.profession ?? "",
          salary: fields.salary ?? "",
          telephone: fields.telephone ?? "",
        }}
        submitLabel="Save changes"
        onSubmit={(data) =>
          updateSubscriber({ data, id, callback: handleUpdated })
        }
      />
    </StyledContainer>
  );
};

export default UpdateSubscriberPage;
