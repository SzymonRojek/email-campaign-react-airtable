import { useNavigate, useParams } from "react-router";

import { updateSubscriber } from "services";
import { useSubscriber } from "customHooks/queries";
import { toastSuccess } from "helpers";
import { Error, Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { PageHeader } from "components/PageHeader";
import SubscriberForm from "components/subscribers/SubscriberForm";
import { SubscriberFields } from "types";

const UpdateSubscriberPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: subscriber, isLoading, isError } = useSubscriber(
    id,
    "Subscriber does not exist! "
  );

  const handleUpdated = (updated: SubscriberFields) => {
    toastSuccess(`Subscriber ${updated.name} has been edited`);
    navigate("/subscribers");
  };

  if (isLoading) return <Loader />;
  if (isError || !subscriber) return <Error error="Subscriber does not exist!" />;

  const { fields } = subscriber;

  return (
    <StyledContainer>
      <PageHeader
        title="Edit subscriber"
        description={`${fields.name} ${fields.surname}`}
        back={{ to: "/subscribers", label: "Subscribers" }}
      />
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
        currentId={id}
        onSubmit={(data) =>
          updateSubscriber({ data, id, callback: handleUpdated })
        }
      />
    </StyledContainer>
  );
};

export default UpdateSubscriberPage;
