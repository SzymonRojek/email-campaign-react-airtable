import * as Yup from "yup";

import type validationCandidate from "helpers/validationCandidate";
import type validationJobOffer from "helpers/validationJobOffer";
import type validationFeedback from "helpers/validationFeedback";

export type CandidateStatus = "open to offers" | "awaiting consent" | "do not contact" | "opted out";
export type JobOfferStatus = "sent" | "draft";

export interface AirtableRecord<Fields> {
  id: string;
  createdTime: string;
  fields: Fields;
}

export interface CandidateFields {
  name: string;
  surname: string;
  email: string;
  status: CandidateStatus;
  role?: string;
  expectedSalary?: string;
  phone?: string;
  date?: string;
}

export interface JobOfferFields {
  subject: string;
  message: string;
  status: JobOfferStatus;
  date?: string;
}

export type Candidate = AirtableRecord<CandidateFields>;
export type JobOffer = AirtableRecord<JobOfferFields>;

// form values (react-hook-form) - derived from the yup schemas so they always match
export type CandidateFormValues = Yup.InferType<typeof validationCandidate>;
export type JobOfferFormValues = Yup.InferType<typeof validationJobOffer>;
export type FeedbackFormValues = Yup.InferType<typeof validationFeedback>;

export interface SelectOption {
  value: string;
  label: string;
}


// a row of the outbox - one e-mail of a sent job offer
export interface EmailFields {
  email: string;
  // the name and surname when the e-mail went out
  name: string;
  candidateId: string;
  jobOfferId: string;
  sentAt: string;
}

export type Email = AirtableRecord<EmailFields>;

// GET /api/candidates/:id/outbox - a job offer the candidate got
export interface ReceivedEmail {
  id: string;
  jobOfferId: string;
  subject: string;
  sentAt: string;
}

// GET /api/outbox - one e-mail of the outbox with its job offer's title
export interface SentEmail extends ReceivedEmail {
  candidateId: string;
  name: string;
  email: string;
}

// GET /api/outbox/:id/preview (a sent e-mail), POST /api/job-offers/preview (a draft)
export interface EmailPreview {
  from: { name: string; address: string };
  to: string;
  toName: string;
  subject: string;
  html: string;
  // only a sent e-mail has it
  sentAt?: string;
}

// GET /api/feedback - approved feedback its author let show
export interface Feedback {
  id: string;
  name: string;
  role: string;
  message: string;
  date: string;
}
