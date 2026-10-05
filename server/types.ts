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
