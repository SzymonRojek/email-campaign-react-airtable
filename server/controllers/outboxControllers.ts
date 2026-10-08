import { Request, Response } from "express";

import { axiosInstance } from "./axiosInstance";
import { chunks, wait } from "../helpers/batches";
import { getAllRecords } from "../helpers/getAllRecords";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { buildEmail, unknownPlaceholders } from "../mail/buildEmail";
import { deliver } from "../mail/deliver";
import { readUnsubscribeToken, unsubscribeUrl } from "../mail/unsubscribeToken";
import { AirtableRecord, CampaignFields, EmailFields, SubscriberFields } from "../types";

// the outbox: one row in the "emails" table per e-mail of a sent campaign
const emailsEndpoint = "/emails";

// Airtable record ids only - they go into a formula, nothing else may get there
const isRecordId = (id: unknown): id is string =>
  typeof id === "string" && /^rec[A-Za-z0-9]+$/.test(id);

// the address of the app the links in the e-mails lead to (behind Render's proxy too)
const appOrigin = (req: Request) => `${req.protocol}://${req.get("host")}`;

const fullName = ({ name = "", surname = "" }: SubscriberFields) =>
  `${name} ${surname}`.trim();

// e.g. "Unknown placeholder: {{nmae}}" - or null when the texts are fine
const placeholderError = ({ title, description }: CampaignFields) => {
  const unknown = unknownPlaceholders(title, description);
  if (unknown.length === 0) return null;

  const list = unknown.map((key) => `{{${key}}}`).join(", ");
  return `Unknown placeholder${unknown.length > 1 ? "s" : ""}: ${list} - use {{name}} or {{surname}}`;
};

const emailsOf = async (campaignId: string) =>
  (
    await getAllRecords(emailsEndpoint, {
      filterByFormula: `{campaignId}='${campaignId}'`,
    })
  ).filter(({ fields }) => fields.campaignId === campaignId) as AirtableRecord<EmailFields>[];

// POST /api/campaigns/:id/send  { recipientIds?: [...] }
// a draft goes to its recipients (only active subscribers; all of them without recipientIds)
export const sendCampaign = async (req: Request, res: Response) => {
  const { id } = req.params;
  const recipientIds: unknown = req.body?.recipientIds;

  if (!isRecordId(id)) {
    return res.status(404).json({ status: "fail", error: "Campaign does not exist" });
  }

  try {
    const { data: campaign } = await axiosInstance.get<AirtableRecord<CampaignFields>>(
      `/campaigns/${id}`
    );

    if (campaign.fields.status === "sent") {
      return res.status(409).json({ status: "fail", error: "This campaign has already been sent" });
    }

    const invalidText = placeholderError(campaign.fields);
    if (invalidText) return res.status(400).json({ status: "fail", error: invalidText });

    const chosen = Array.isArray(recipientIds) ? new Set(recipientIds.map(String)) : null;
    const recipients = (
      (await getAllRecords("/subscribers")) as AirtableRecord<SubscriberFields>[]
    ).filter(
      ({ id: subscriberId, fields }) =>
        fields.status === "active" && (!chosen || chosen.has(subscriberId))
    );

    if (recipients.length === 0) {
      return res.status(400).json({ status: "fail", error: "There are no active recipients" });
    }

    const sentAt = new Date().toISOString();
    const origin = appOrigin(req);

    await deliver(
      recipients.map(({ id: subscriberId, fields }) =>
        buildEmail({
          campaign: campaign.fields,
          recipient: { name: fields.name, surname: fields.surname, email: fields.email },
          unsubscribeUrl: unsubscribeUrl(origin, subscriberId),
        })
      )
    );

    // the outbox first - the campaign is "sent" only when its e-mails are saved
    for (const [i, batch] of chunks(recipients).entries()) {
      if (i > 0) await wait(250);
      await axiosInstance.post(emailsEndpoint, {
        records: batch.map(({ id: subscriberId, fields }) => ({
          fields: {
            email: fields.email,
            name: fullName(fields),
            subscriberId,
            campaignId: id,
            sentAt,
          },
        })),
      });
    }

    const { data } = await axiosInstance.patch(`/campaigns/${id}`, {
      fields: { status: "sent", date: sentAt },
    });

    res.status(200).json({ status: "ok", sent: recipients.length, sentAt, campaign: data });
  } catch (error) {
    res.status(400).json({ status: "fail", error: getErrorMessage(error) });
  }
};

// GET /api/campaigns/:id/emails - who got the campaign
export const getCampaignEmails = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isRecordId(id)) return res.status(200).json([]);

  try {
    const emails = await emailsOf(id);

    emails.sort((a, b) => (a.fields.name ?? "").localeCompare(b.fields.name ?? "", "pl"));
    res.status(200).json(emails);
  } catch (error) {
    res.status(400).json({ status: "fail", error: getErrorMessage(error) });
  }
};

// GET /api/emails/:id/preview - the e-mail exactly as its recipient got it
export const getEmailPreview = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data: email } = await axiosInstance.get<AirtableRecord<EmailFields>>(
      `${emailsEndpoint}/${id}`
    );
    const { campaignId = "", subscriberId = "", name, sentAt } = email.fields;
    const { data: campaign } = await axiosInstance.get<AirtableRecord<CampaignFields>>(
      `/campaigns/${campaignId}`
    );

    // the e-mail uses the name the subscriber had when it went out
    const [firstName, ...surname] = (name ?? "").split(" ");
    const built = buildEmail({
      campaign: campaign.fields,
      recipient: { name: firstName, surname: surname.join(" "), email: email.fields.email },
      unsubscribeUrl: unsubscribeUrl(appOrigin(req), subscriberId),
    });

    res.status(200).json({ ...built, toName: name ?? "", sentAt });
  } catch (error) {
    res.status(404).json({ status: "fail", error: "E-mail does not exist" });
  }
};

// POST /api/campaigns/preview  { title, description, subscriberId }
// a campaign that is being written, as this subscriber would get it
export const previewCampaign = async (req: Request, res: Response) => {
  const { title = "", description = "", subscriberId } = req.body ?? {};
  const campaign = { title: String(title), description: String(description) };

  const invalidText = placeholderError(campaign);
  if (invalidText) return res.status(400).json({ status: "fail", error: invalidText });

  if (!isRecordId(subscriberId)) {
    return res.status(404).json({ status: "fail", error: "Subscriber does not exist" });
  }

  try {
    const { data: subscriber } = await axiosInstance.get<AirtableRecord<SubscriberFields>>(
      `/subscribers/${subscriberId}`
    );
    const { name, surname, email } = subscriber.fields;
    const built = buildEmail({
      campaign,
      recipient: { name, surname, email },
      unsubscribeUrl: unsubscribeUrl(appOrigin(req), subscriberId),
    });

    res.status(200).json({ ...built, toName: fullName(subscriber.fields) });
  } catch (error) {
    res.status(404).json({ status: "fail", error: "Subscriber does not exist" });
  }
};

// deleting a campaign also empties its outbox
export const deleteCampaignEmails = async (campaignId: string) => {
  if (!isRecordId(campaignId)) return;

  const ids = (await emailsOf(campaignId)).map(({ id }) => id);

  for (const [i, batch] of chunks(ids).entries()) {
    if (i > 0) await wait(250);
    await axiosInstance.delete(emailsEndpoint, { params: { records: batch } });
  }
};

const subscriberFromToken = async (token: unknown) => {
  const subscriberId = readUnsubscribeToken(token);
  if (!subscriberId) return null;

  const { data } = await axiosInstance.get<AirtableRecord<SubscriberFields>>(
    `/subscribers/${subscriberId}`
  );
  return data;
};

const invalidLink = { status: "fail", error: "This unsubscribe link is not valid" };

// GET /api/unsubscribe/:token - public: who the link belongs to (for the confirmation page)
export const getUnsubscribe = async (req: Request, res: Response) => {
  try {
    const subscriber = await subscriberFromToken(req.params.token);
    if (!subscriber) return res.status(404).json(invalidLink);

    res.status(200).json({
      email: subscriber.fields.email,
      isUnsubscribed: subscriber.fields.status === "unsubscribed",
    });
  } catch (error) {
    res.status(404).json(invalidLink);
  }
};

// POST /api/unsubscribe/:token - public: the subscriber stops getting campaigns
export const postUnsubscribe = async (req: Request, res: Response) => {
  try {
    const subscriber = await subscriberFromToken(req.params.token);
    if (!subscriber) return res.status(404).json(invalidLink);

    // typecast: Airtable adds the "unsubscribed" choice to the status field if it is missing
    await axiosInstance.patch(`/subscribers/${subscriber.id}`, {
      fields: { status: "unsubscribed" },
      typecast: true,
    });

    res.status(200).json({ status: "ok", email: subscriber.fields.email });
  } catch (error) {
    res.status(404).json(invalidLink);
  }
};
