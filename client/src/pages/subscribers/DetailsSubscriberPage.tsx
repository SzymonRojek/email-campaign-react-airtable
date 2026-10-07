import { Link, useParams } from "react-router";
import { Pencil } from "lucide-react";

import { formatMobileNumber, formattedData } from "helpers";
import { useSubscriber } from "customHooks/queries";
import { Error, Loader } from "components/DisplayMessage";
import { PageHeader } from "components/PageHeader";
import { StyledContainer } from "components/StyledContainer";
import Avatar from "components/Avatar";
import StatusBadge from "components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const DetailsSubscriberPage = () => {
  const { id } = useParams();
  const { data: subscriber, isLoading, isError } = useSubscriber(
    id,
    "Subscriber does not exist! "
  );

  if (isLoading) return <Loader />;
  if (isError || !subscriber) return <Error error="Subscriber does not exist!" />;

  const { fields, createdTime } = subscriber;

  const details = [
    { label: "E-mail", value: fields.email },
    { label: "Profession", value: fields.profession },
    { label: "Salary", value: fields.salary },
    { label: "Telephone", value: `+44 ${formatMobileNumber(fields.telephone)}` },
    {
      label: "Added",
      value: formattedData.getFormattedDateTime(fields.date || createdTime),
    },
  ];

  return (
    <StyledContainer>
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            <Avatar name={fields.name} surname={fields.surname} className="size-10 text-sm" />
            {fields.name} {fields.surname}
            <StatusBadge status={fields.status} />
          </span>
        }
        back={{ to: "/subscribers", label: "Subscribers" }}
        actions={
          <Button asChild variant="outline">
            <Link to={`/subscribers/edit/${id}`}>
              <Pencil />
              Edit
            </Link>
          </Button>
        }
      />
      <Card className="max-w-2xl">
        <CardContent>
          <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {details.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {label}
                </dt>
                <dd className="mt-1 font-medium break-words">{value || "-"}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </StyledContainer>
  );
};

export default DetailsSubscriberPage;
