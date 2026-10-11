export interface AirtableRecord<Fields = Record<string, unknown>> {
  id: string;
  createdTime: string;
  fields: Fields;
}

export interface AirtableListResponse<Fields = Record<string, unknown>> {
  records: AirtableRecord<Fields>[];
  offset?: string;
}

export interface JobOfferFields {
  subject?: string;
  message?: string;
  status?: string;
}

export interface CandidateFields {
  name?: string;
  surname?: string;
  email?: string;
  status?: string;
  role?: string;
  expectedSalary?: string;
  phone?: string;
}

// a row of the outbox ("emails" table) - one e-mail of a sent job offer
export interface EmailFields {
  email?: string;
  // the candidate's name and surname when the e-mail went out
  name?: string;
  candidateId?: string;
  jobOfferId?: string;
  sentAt?: string;
}

// a row of the "feedback" table - shown only when the owner approves it in Airtable
export interface FeedbackFields {
  name?: string;
  role?: string;
  message?: string;
  approved?: boolean;
  date?: string;
}
