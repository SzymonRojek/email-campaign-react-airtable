import { useNavigate } from "react-router";

import { createSubscriber } from "services";
import { toastSuccess } from "helpers";
import { StyledContainer } from "components/StyledContainer";
import { PageHeader } from "components/PageHeader";
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
      <PageHeader
        title="New subscriber"
        description="Add a person to your mailing list."
        back={{ to: "/subscribers", label: "Subscribers" }}
      />
      <SubscriberForm
        submitLabel="Add subscriber"
        onSubmit={(data) => createSubscriber({ data, callback: handleCreated })}
      />
    </StyledContainer>
  );
};

export default CreateSubscriberPage;
