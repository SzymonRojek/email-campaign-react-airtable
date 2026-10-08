import { Navigate, useParams, useSearchParams } from "react-router";
import { Copy, Download, Mail } from "lucide-react";

import { formattedData, pluralize } from "helpers";
import { downloadCsv, toCsv } from "helpers/csv";
import { useCampaign, useCampaignEmails } from "customHooks/queries";
import { Error, Loader } from "components/DisplayMessage";
import { PageHeader } from "components/PageHeader";
import { StyledContainer } from "components/StyledContainer";
import Avatar from "components/Avatar";
import StatusBadge from "components/StatusBadge";
import EmailPreviewPanel from "components/campaigns/EmailPreviewPanel";
import { DEMO_EMAIL_NOTICE } from "components/campaigns/demoNotice";
import { useDuplicateCampaign } from "components/campaigns/useDuplicateCampaign";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// the e-mail preview lives in the address too: /campaigns/<id>?email=<email id>
const EMAIL_PARAM = "email";

// "Autumn sale!" -> "autumn-sale"
const toFileName = (title = "") =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "campaign";

// a sent campaign: its message and who got it, with every e-mail to open
const CampaignDetailsPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const duplicate = useDuplicateCampaign();
  const { data: campaign, isLoading, isError } = useCampaign(id, "Campaign does not exist! ");
  const { data: emails, isLoading: isLoadingEmails } = useCampaignEmails(id);

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
  if (isError || !campaign) return <Error error="Campaign does not exist!" />;

  // a draft has no recipients yet - it opens in the editor
  if (campaign.fields.status === "draft") {
    return <Navigate to={`/campaigns/edit/${id}`} replace />;
  }

  const { fields, createdTime } = campaign;
  const sentAt = formattedData.getFormattedDateTime(fields.date || createdTime);

  return (
    <StyledContainer>
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            {fields.title}
            <StatusBadge status={fields.status} />
          </span>
        }
        description={
          emails
            ? `Sent ${sentAt} to ${pluralize(emails.length, "subscriber")}`
            : `Sent ${sentAt}`
        }
        back={{ to: "/campaigns", label: "Campaigns" }}
        actions={
          <>
            <Button
              variant="outline"
              disabled={!emails?.length}
              onClick={() =>
                downloadCsv(
                  `${toFileName(fields.title)}-recipients-${new Date().toISOString().slice(0, 10)}.csv`,
                  toCsv([
                    ["name", "email", "sentAt"],
                    ...(emails ?? []).map(({ fields: email }) => [email.name, email.email, email.sentAt]),
                  ])
                )
              }
            >
              <Download />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => duplicate(campaign)}>
              <Copy />
              Duplicate
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Message</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <p className="whitespace-pre-line">{fields.description}</p>
            <p className="text-xs text-muted-foreground">{DEMO_EMAIL_NOTICE}</p>
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b py-4">
            <CardTitle className="text-base">Recipients</CardTitle>
          </CardHeader>
          {isLoadingEmails ? (
            <Loader title="Loading the recipients..." />
          ) : !emails?.length ? (
            // e.g. sent before the outbox existed
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              No e-mails are saved for this campaign.
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
                      aria-label={`View the e-mail to ${email.name}`}
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

export default CampaignDetailsPage;
