import { useNavigate } from "react-router";

import { createSubscriber } from "services";
import { toastSuccess } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import SubscriberForm from "components/subscribers/SubscriberForm";
import { SubscriberFields } from "types";

const CreateSubscriberPage = () => {
  const navigate = useNavigate();

  // back to the list - the new subscriber is at the top (newest first)
  const handleCreated = (subscriber: SubscriberFields) => {
    toastSuccess(`Subscriber ${subscriber.name} has been added`);
    navigate("/subscribers");
  };

  return (
    <StyledContainer>
      <StyledHeading label="new subscriber" />
      <SubscriberForm
        submitLabel="Add subscriber"
        onSubmit={(data) => createSubscriber({ data, callback: handleCreated })}
      />
    </StyledContainer>
  );
};

export default CreateSubscriberPage;
