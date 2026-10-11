import { JobOfferStatus, CandidateStatus } from "types";

// the stored values, written for people ("awaiting consent" = the candidate has not
// agreed to get job offers yet)
const statusLabels: Record<CandidateStatus | JobOfferStatus, string> = {
  "open to offers": "Open to offers",
  "awaiting consent": "Awaiting consent",
  "do not contact": "Do not contact",
  "opted out": "Opted out",
  sent: "Sent",
  draft: "Draft",
};

const statusLabel = (status: string) =>
  statusLabels[status as keyof typeof statusLabels] ?? status;

export default statusLabel;
