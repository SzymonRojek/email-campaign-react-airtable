import { ReactNode } from "react";
import { Link } from "react-router";
import { BsGithub } from "react-icons/bs";
import { SiAirtable } from "react-icons/si";
import { ArrowRight, Plus, Send, UserCheck, Users, type LucideIcon } from "lucide-react";

import { formattedData, pluralize, sortByDate } from "helpers";
import { useCampaigns, useSubscribers } from "customHooks/queries";
import { Error, Loader } from "components/DisplayMessage";
import { PageHeader } from "components/PageHeader";
import { StyledContainer } from "components/StyledContainer";
import StatusBadge from "components/StatusBadge";
import SubscriberIdentity from "components/subscribers/SubscriberIdentity";
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
        <p className="text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>
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

// "Recent campaigns" / "Newest subscribers" with a link to the full list
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
  const subscribersQuery = useSubscribers("Cannot get subscribers list.");
  const campaignsQuery = useCampaigns("Can not get campaigns list");

  if (subscribersQuery.isLoading || campaignsQuery.isLoading) return <Loader />;
  if (!subscribersQuery.data || !campaignsQuery.data)
    return <Error error="Cannot load the data - please try again later." />;

  const subscribers = subscribersQuery.data;
  const campaigns = campaignsQuery.data;
  const count = (status: string, items: { fields: { status: string } }[]) =>
    items.filter(({ fields }) => fields.status === status).length;

  const active = count("active", subscribers);
  const sent = count("sent", campaigns);

  return (
    <StyledContainer>
      <PageHeader
        title="Dashboard"
        description="Your subscribers and campaigns at a glance."
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/subscribers/add">
                <Plus />
                Add subscriber
              </Link>
            </Button>
            <Button asChild variant="brand">
              <Link to="/campaigns/add">
                <Send />
                New campaign
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Subscribers"
          value={subscribers.length}
          hint={`${count("pending", subscribers)} pending · ${count("blocked", subscribers)} blocked`}
          icon={Users}
          to="/subscribers"
        />
        <StatCard
          label="Active subscribers"
          value={active}
          hint="receive your next campaign"
          icon={UserCheck}
          to="/subscribers"
        />
        <StatCard
          label="Campaigns sent"
          value={sent}
          hint={`${pluralize(campaigns.length - sent, "draft")} waiting`}
          icon={Send}
          to="/campaigns"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ListCard
          title="Recent campaigns"
          to="/campaigns"
          emptyMessage="No campaigns yet."
        >
          {sortByDate(campaigns, "newest")
            .slice(0, RECENT_COUNT)
            .map(({ id, fields, createdTime }) => (
              <li key={id} className="flex items-center justify-between gap-3 px-6 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{fields.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formattedData.getFormattedDateTime(fields.date || createdTime)}
                  </p>
                </div>
                <StatusBadge status={fields.status} />
              </li>
            ))}
        </ListCard>

        <ListCard
          title="Newest subscribers"
          to="/subscribers"
          emptyMessage="No subscribers yet."
        >
          {sortByDate(subscribers, "newest")
            .slice(0, RECENT_COUNT)
            .map((subscriber) => (
              <li
                key={subscriber.id}
                className="flex items-center justify-between gap-3 px-6 py-3"
              >
                <SubscriberIdentity subscriber={subscriber} />
                <StatusBadge status={subscriber.fields.status} />
              </li>
            ))}
        </ListCard>
      </div>

      <Card className="mt-6 border-dashed bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-base">About this demo</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground md:grid-cols-[1fr_auto] md:items-end">
          <ul className="grid list-disc gap-1.5 pl-5">
            <li>
              React 19 + TypeScript app with an Express API in front of Airtable -
              the Airtable key never reaches the browser.
            </li>
            <li>
              Demo mode: e-mails are not really sent, a campaign is only marked as
              sent.
            </li>
            <li>
              Feel free to add, edit and remove anything - the example data comes
              back every night.
            </li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a
                href="https://github.com/SzymonRojek/email-campaign-react-airtable"
                target="_blank"
                rel="noreferrer"
              >
                <BsGithub />
                README
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="https://airtable.com/" target="_blank" rel="noreferrer">
                <SiAirtable />
                Airtable
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </StyledContainer>
  );
};

export default DashboardPage;
