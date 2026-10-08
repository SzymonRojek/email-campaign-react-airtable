import * as Yup from "yup";

import type validationSubscriber from "helpers/validationSubscriber";
import type validationCampaign from "helpers/validationCampaign";
import type validationLogin from "helpers/validationLogin";

export type SubscriberStatus = "active" | "pending" | "blocked" | "unsubscribed";
export type CampaignStatus = "sent" | "draft";

export interface AirtableRecord<Fields> {
  id: string;
  createdTime: string;
  fields: Fields;
}

export interface SubscriberFields {
  name: string;
  surname: string;
  email: string;
  status: SubscriberStatus;
  profession?: string;
  salary?: string;
  telephone?: string;
  date?: string;
}

export interface CampaignFields {
  title: string;
  description: string;
  status: CampaignStatus;
  date?: string;
}

export type Subscriber = AirtableRecord<SubscriberFields>;
export type Campaign = AirtableRecord<CampaignFields>;

// form values (react-hook-form) - derived from the yup schemas so they always match
export type SubscriberFormValues = Yup.InferType<typeof validationSubscriber>;
export type CampaignFormValues = Yup.InferType<typeof validationCampaign>;
export type LoginFormValues = Yup.InferType<typeof validationLogin>;

export interface SelectOption {
  value: string;
  label: string;
}


// a row of the outbox - one e-mail of a sent campaign
export interface EmailFields {
  email: string;
  // the name and surname when the e-mail went out
  name: string;
  subscriberId: string;
  campaignId: string;
  sentAt: string;
}

export type Email = AirtableRecord<EmailFields>;

// GET /api/subscribers/:id/emails - a campaign the subscriber got
export interface ReceivedEmail {
  id: string;
  campaignId: string;
  title: string;
  sentAt: string;
}

// GET /api/emails/:id/preview (a sent e-mail), POST /api/campaigns/preview (a draft)
export interface EmailPreview {
  from: { name: string; address: string };
  to: string;
  toName: string;
  subject: string;
  html: string;
  // only a sent e-mail has it
  sentAt?: string;
}
