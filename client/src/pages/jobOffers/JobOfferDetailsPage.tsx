import { Navigate, useParams, useSearchParams } from "react-router";
import { Copy, Download, Mail } from "lucide-react";

import { formattedData, pluralize } from "helpers";
import { downloadCsv } from "helpers/csv";
import { emailsToCsv, recipientsFileName } from "components/jobOffers/emailsCsv";
import { useJobOffer, useJobOfferEmails } from "customHooks/queries";
import { Error, Loader } from "components/DisplayMessage";
import { PageHeader } from "components/PageHeader";
import { StyledContainer } from "components/StyledContainer";
import Avatar from "components/Avatar";
import StatusBadge from "components/StatusBadge";
import EmailPreviewPanel from "components/jobOffers/EmailPreviewPanel";
import { DEMO_EMAIL_NOTICE } from "components/jobOffers/demoNotice";
import { useDuplicateJobOffer } from "components/jobOffers/useDuplicateJobOffer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// the e-mail preview lives in the address too: /job-offers/<id>?email=<email id>
const EMAIL_PARAM = "email";

// a sent job offer: its message and who got it, with every e-mail to open
const JobOfferDetailsPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const duplicate = useDuplicateJobOffer();
  const { data: jobOffer, isLoading, isError } = useJobOffer(id, "Job offer does not exist! ");
  const { data: emails, isLoading: isLoadingEmails } = useJobOfferEmails(id);

  const emailId = searchParams.get(EMAIL_PARAM);
  const showEmail = (next: string | null) =>
    setSearchParams(
      (params) => {
        if (next) params.set(EMAIL_PARAM, next);
        else params.delete(EMAIL_PARAM);
        return params;
      },
      { replace: Boolean(emailId) || !next }
    );

  if (isLoading) return <Loader />;
  if (isError || !jobOffer) return <Error error="Job offer does not exist!" />;

  // a draft has no recipients yet - it opens in the editor
  if (jobOffer.fields.status === "draft") {
    return <Navigate to={`/job-offers/edit/${id}`} replace />;
  }

  const { fields, createdTime } = jobOffer;
  const sentAt = formattedData.getFormattedDateTime(fields.date || createdTime);

  return (
    <StyledContainer>
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            {fields.subject}
            <StatusBadge status={fields.status} />
          </span>
        }
        // known at once - the number of recipients is in their card (no jump when it loads)
        description={`Sent ${sentAt}`}
        back={{ to: "/job-offers", label: "Job offers" }}
        actions={
          <Button variant="outline" onClick={() => duplicate(jobOffer)}>
            <Copy />
            Duplicate
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Message</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <p className="whitespace-pre-line">{fields.message}</p>
            <p className="text-xs text-muted-foreground">{DEMO_EMAIL_NOTICE}</p>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="flex items-center justify-between border-b py-4">
            <CardTitle className="text-base">
              Recipients
              {emails && (
                <span className="ml-2 font-normal text-muted-foreground">
                  {pluralize(emails.length, "candidate")}
                </span>
              )}
            </CardTitle>
            {Boolean(emails?.length) && (
              <Button
                variant="outline"
                size="sm"
                title="Download the recipients of this job offer"
                onClick={() =>
                  downloadCsv(
                    recipientsFileName(fields.subject),
                    emailsToCsv((emails ?? []).map(({ fields: email }) => email))
                  )
                }
              >
                <Download />
                Export CSV
              </Button>
            )}
          </CardHeader>
          {isLoadingEmails ? (
            <Loader title="Loading the recipients..." />
          ) : !emails?.length ? (
            // e.g. sent before the outbox existed
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              No e-mails are saved for this job offer.
            </p>
          ) : (
            <ul aria-label="Recipients" className="divide-y">
              {emails.map(({ id: rowId, fields: email }) => {
                const [name = "", surname = ""] = email.name.split(" ");

                return (
                  <li key={rowId} className="flex items-center justify-between gap-3 px-6 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={name} surname={surname} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{email.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{email.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showEmail(rowId)}
                      // starts with the visible text, so voice control ("click View e-mail") finds it
                      aria-label={`View e-mail to ${email.name}`}
                    >
                      <Mail />
                      View e-mail
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <EmailPreviewPanel emailId={emailId} onClose={() => showEmail(null)} />
    </StyledContainer>
  );
};

export default JobOfferDetailsPage;
