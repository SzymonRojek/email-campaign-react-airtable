export interface AirtableRecord<Fields = Record<string, unknown>> {
  id: string;
  createdTime: string;
  fields: Fields;
}

export interface AirtableListResponse<Fields = Record<string, unknown>> {
  records: AirtableRecord<Fields>[];
  offset?: string;
}

export interface CampaignFields {
  title?: string;
  description?: string;
  status?: string;
}

export interface SubscriberFields {
  name?: string;
  surname?: string;
  email?: string;
  status?: string;
  profession?: string;
  salary?: string;
  telephone?: string;
}

// a row of the outbox ("emails" table) - one e-mail of a sent campaign
export interface EmailFields {
  email?: string;
  // the subscriber's name and surname when the e-mail went out
  name?: string;
  subscriberId?: string;
  campaignId?: string;
  sentAt?: string;
}

// a row of the "feedback" table - shown only when approved (by the owner) and isPublic (by its author)
export interface FeedbackFields {
  name?: string;
  role?: string;
  message?: string;
  isPublic?: boolean;
  approved?: boolean;
  date?: string;
}
