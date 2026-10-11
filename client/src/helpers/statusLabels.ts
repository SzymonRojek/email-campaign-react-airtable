import { CampaignStatus, SubscriberStatus } from "types";

// the words a recruiter uses - Airtable keeps the stored values
// ("pending" = the candidate has not agreed to get job offers yet)
const statusLabels: Record<SubscriberStatus | CampaignStatus, string> = {
  active: "Open to offers",
  pending: "Awaiting consent",
  blocked: "Do not contact",
  unsubscribed: "Opted out",
  sent: "Sent",
  draft: "Draft",
};

const statusLabel = (status: string) =>
  statusLabels[status as keyof typeof statusLabels] ?? status;

export default statusLabel;
