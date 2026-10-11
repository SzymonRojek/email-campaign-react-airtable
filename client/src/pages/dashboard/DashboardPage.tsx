import { ReactNode } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Plus,
  Send,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { formattedData, pluralize, sortByDate } from "helpers";
import { useJobOffers, useCandidates } from "customHooks/queries";
import { candidatePanelLink } from "customHooks/useCandidatePanel";
import { Error, Loader } from "components/DisplayMessage";
import { PageHeader } from "components/PageHeader";
import { StyledContainer } from "components/StyledContainer";
import StatusBadge from "components/StatusBadge";
import CandidateIdentity from "components/candidates/CandidateIdentity";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RECENT_COUNT = 5;

interface StatCardProps {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  to: string;
}

const StatCard = ({ label, value, hint, icon: Icon, to }: StatCardProps) => (
  <Link
    to={to}
    className="group rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
  >
    <Card className="h-full gap-1 py-4 transition-colors group-hover:border-brand/50 sm:gap-3 sm:py-6">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" aria-hidden />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  </Link>
);

interface ListCardProps {
  title: string;
  to: string;
  emptyMessage: string;
  children: ReactNode[];
}

// "Recent job offers" / "Newest candidates" with a link to the full list
const ListCard = ({ title, to, emptyMessage, children }: ListCardProps) => (
  <Card className="gap-0 py-0">
    <CardHeader className="flex items-center justify-between border-b py-4">
      <CardTitle className="text-base">{title}</CardTitle>
      <Link
        to={to}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        View all <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </CardHeader>
    {children.length === 0 ? (
      <p className="px-6 py-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    ) : (
      <ul aria-label={title} className="divide-y">
        {children}
      </ul>
    )}
  </Card>
);

const DashboardPage = () => {
  const candidatesQuery = useCandidates("Cannot get the candidates list.");
  const jobOffersQuery = useJobOffers("Cannot get the job offers list.");

  if (candidatesQuery.isLoading || jobOffersQuery.isLoading) return <Loader />;
  if (!candidatesQuery.data || !jobOffersQuery.data)
    return (
      <Error
        error="Cannot load the data - please try again later."
        onRetry={() => {
          candidatesQuery.refetch();
          jobOffersQuery.refetch();
        }}
        isRetrying={candidatesQuery.isFetching || jobOffersQuery.isFetching}
      />
    );

  const candidates = candidatesQuery.data;
  const jobOffers = jobOffersQuery.data;
  const count = (status: string, items: { fields: { status: string } }[]) =>
    items.filter(({ fields }) => fields.status === status).length;

  const active = count("open to offers", candidates);
  const sent = count("sent", jobOffers);

  return (
    <StyledContainer>
      <PageHeader
        title="Dashboard"
        description="Your candidates and job offers at a glance."
        actions={
          <>
            <Button asChild variant="outline">
              <Link {...candidatePanelLink(undefined, "new")}>
                <Plus />
                Add candidate
              </Link>
            </Button>
            <Button asChild variant="brand">
              <Link to="/job-offers/add">
                <Send />
                New job offer
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Candidates"
          value={candidates.length}
          hint={[
            `${count("awaiting consent", candidates)} awaiting consent`,
            `${count("do not contact", candidates)} do not contact`,
            count("opted out", candidates) &&
              `${count("opted out", candidates)} opted out`,
          ]
            .filter(Boolean)
            .join(" · ")}
          icon={Users}
          to="/candidates"
        />
        <StatCard
          label="Open to offers"
          value={active}
          hint="can get your next job offer"
          icon={UserCheck}
          to="/candidates"
        />
        <StatCard
          label="Job offers sent"
          value={sent}
          hint={`${pluralize(jobOffers.length - sent, "draft")} waiting`}
          icon={Send}
          to="/job-offers"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ListCard
          title="Recent job offers"
          to="/job-offers"
          emptyMessage="No job offers yet."
        >
          {sortByDate(jobOffers, "newest")
            .slice(0, RECENT_COUNT)
            .map((jobOffer) => {
              const { id, fields, createdTime } = jobOffer;

              return (
                <li
                  key={id}
                  className="flex items-center justify-between gap-3 px-6 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {fields.subject}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formattedData.getFormattedDateTime(
                        fields.date || createdTime,
                      )}
                    </p>
                  </div>
                  <StatusBadge status={fields.status} />
                </li>
              );
            })}
        </ListCard>

        <ListCard
          title="Newest candidates"
          to="/candidates"
          emptyMessage="No candidates yet."
        >
          {sortByDate(candidates, "newest")
            .slice(0, RECENT_COUNT)
            .map((candidate) => (
              <li
                key={candidate.id}
                className="flex items-center justify-between gap-3 px-6 py-3"
              >
                <CandidateIdentity candidate={candidate} />
                <StatusBadge status={candidate.fields.status} />
              </li>
            ))}
        </ListCard>
      </div>

      <Card className="mt-6 border-dashed bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-base">About this demo</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="grid list-disc gap-1.5 pl-5">
            <li>
              Built for a small recruitment agency: pick a role and a budget, and the job
              offer goes to the matching candidates - personalized, and not to anyone who
              got an offer in the last 14 days.
            </li>
            <li>
              React 19 + TypeScript app with an Express API in front of Airtable
              - the Airtable token never reaches the browser.
            </li>
            <li>
              Demo mode: nobody really gets the e-mails - each one is saved in
              the offer&apos;s outbox, where you can open it.
            </li>
            <li>
              Feel free to add, edit and remove anything - the example data
              comes back every night.
            </li>
          </ul>
        </CardContent>
      </Card>
    </StyledContainer>
  );
};

export default DashboardPage;
