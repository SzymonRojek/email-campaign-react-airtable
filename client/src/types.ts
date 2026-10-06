import * as Yup from "yup";

import type validationSubscriber from "helpers/validationSubscriber";
import type validationCampaign from "helpers/validationCampaign";
import type validationLogin from "helpers/validationLogin";

export type SubscriberStatus = "active" | "pending" | "blocked";
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

