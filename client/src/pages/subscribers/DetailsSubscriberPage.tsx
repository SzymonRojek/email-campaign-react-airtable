import { useParams } from "react-router";

import { formatMobileNumber, formattedData } from "helpers";
import { useSubscriber } from "customHooks/queries";
import { Error, Loader } from "components/DisplayMessage";
import { StyledContainer } from "components/StyledContainer";
import { StyledHeading } from "components/StyledHeading";
import StatusBadge from "components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DetailsSubscriberPage = () => {
  const { id } = useParams();
  const { data: subscriber, isLoading, isError } = useSubscriber(
    id,
    "Subscriber does not exist! "
  );

  if (isLoading) return <Loader />;
  if (isError || !subscriber) return <Error error="Subscriber does not exist!" />;

  const { fields, createdTime } = subscriber;
  const date = fields.date || createdTime;

  const details = [
    { label: "E-mail", value: fields.email },
    { label: "Profession", value: fields.profession },
    { label: "Salary", value: fields.salary },
    { label: "Telephone", value: `+44 ${formatMobileNumber(fields.telephone)}` },
    {
      label: "Added",
      value: `${formattedData.getFormattedDate(date)}, ${formattedData.getFormattedTime(date)}`,
    },
  ];

  return (
    <StyledContainer>
      <StyledHeading label="subscriber details" />
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-2xl">
            {fields.name} {fields.surname}
          </CardTitle>
          <StatusBadge status={fields.status} />
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            {details.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="font-medium break-words">{value || "-"}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </StyledContainer>
  );
};

export default DetailsSubscriberPage;
