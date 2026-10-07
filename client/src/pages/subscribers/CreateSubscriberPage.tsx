import { useNavigate } from "react-router";

import { createSubscriber } from "services";
import { useConfirmModalState } from "contexts/ConfirmModalContext";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import SubscriberForm from "components/subscribers/SubscriberForm";
import { SubscriberFields } from "types";

const CreateSubscriberPage = () => {
  const navigate = useNavigate();
  const { setConfirmModalState, setConfirmModalText } = useConfirmModalState();

  const handleCreated = (subscriber: SubscriberFields) => {
    setConfirmModalText({
      message: `Subscriber ${subscriber.name} has been added to the list 😁`,
      question: "Would you like to come back to the subscribers list?",
    });
    setConfirmModalState({
      isOpenConfirmModal: true,
      confirmModalProps: {
        onConfirm: () => navigate("/subscribers"),
        onClose: () => setConfirmModalState({ isOpenConfirmModal: false }),
      },
    });
  };

  return (
    <StyledContainer>
      <StyledHeading label="new subscriber" />
      <SubscriberForm
        submitLabel="Add subscriber"
        resetAfterSubmit
        onSubmit={(data) => createSubscriber({ data, callback: handleCreated })}
      />
    </StyledContainer>
  );
};

export default CreateSubscriberPage;
