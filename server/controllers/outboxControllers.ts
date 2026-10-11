import { Request, Response } from "express";

import { axiosInstance } from "./axiosInstance";
import { chunks, wait } from "../helpers/batches";
import { getAllRecords } from "../helpers/getAllRecords";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { buildEmail, unknownPlaceholders } from "../mail/buildEmail";
import { deliver } from "../mail/deliver";
import { readOptOutToken, optOutUrl } from "../mail/optOutToken";
import { AirtableRecord, JobOfferFields, EmailFields, CandidateFields } from "../types";

// the outbox: one row in the "emails" table per e-mail of a sent job offer
const emailsEndpoint = "/outbox";

// Airtable record ids only - they go into a formula, nothing else may get there
const isRecordId = (id: unknown): id is string =>
  typeof id === "string" && /^rec[A-Za-z0-9]+$/.test(id);

// the address of the app the links in the e-mails lead to (behind Render's proxy too)
const appOrigin = (req: Request) => `${req.protocol}://${req.get("host")}`;

const fullName = ({ name = "", surname = "" }: CandidateFields) =>
  `${name} ${surname}`.trim();

// e.g. "Unknown placeholder: {{nmae}}" - or null when the texts are fine
const placeholderError = ({ subject, message }: JobOfferFields) => {
  const unknown = unknownPlaceholders(subject, message);
  if (unknown.length === 0) return null;

  const list = unknown.map((key) => `{{${key}}}`).join(", ");
  return `Unknown placeholder${unknown.length > 1 ? "s" : ""}: ${list} - use {{name}}, {{surname}} or {{role}}`;
};

const emailsOf = async (jobOfferId: string) =>
  (
    await getAllRecords(emailsEndpoint, {
      filterByFormula: `{jobOfferId}='${jobOfferId}'`,
    })
  ).filter(({ fields }) => fields.jobOfferId === jobOfferId) as AirtableRecord<EmailFields>[];

// POST /api/job-offers/:id/send  { recipientIds?: [...] }
// a draft goes to its recipients (only active candidates; all of them without recipientIds)
export const sendJobOffer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const recipientIds: unknown = req.body?.recipientIds;

  if (!isRecordId(id)) {
    return res.status(404).json({ status: "fail", error: "Job offer does not exist" });
  }

  try {
    const { data: jobOffer } = await axiosInstance.get<AirtableRecord<JobOfferFields>>(
      `/jobOffers/${id}`
    );

    if (jobOffer.fields.status === "sent") {
      return res.status(409).json({ status: "fail", error: "This job offer has already been sent" });
    }

    const invalidText = placeholderError(jobOffer.fields);
    if (invalidText) return res.status(400).json({ status: "fail", error: invalidText });

    const chosen = Array.isArray(recipientIds) ? new Set(recipientIds.map(String)) : null;
    const recipients = (
      (await getAllRecords("/candidates")) as AirtableRecord<CandidateFields>[]
    ).filter(
      ({ id: candidateId, fields }) =>
        fields.status === "open to offers" && (!chosen || chosen.has(candidateId))
    );

    if (recipients.length === 0) {
      return res.status(400).json({ status: "fail", error: "There are no active recipients" });
    }

    const sentAt = new Date().toISOString();
    const origin = appOrigin(req);

    await deliver(
      recipients.map(({ id: candidateId, fields }) =>
        buildEmail({
          jobOffer: jobOffer.fields,
          recipient: {
            name: fields.name,
            surname: fields.surname,
            email: fields.email,
            role: fields.role,
          },
          optOutUrl: optOutUrl(origin, candidateId),
        })
      )
    );

    // the outbox first - the job offer is "sent" only when its e-mails are saved
    for (const [i, batch] of chunks(recipients).entries()) {
      if (i > 0) await wait(250);
      await axiosInstance.post(emailsEndpoint, {
        records: batch.map(({ id: candidateId, fields }) => ({
          fields: {
            email: fields.email,
            name: fullName(fields),
            candidateId,
            jobOfferId: id,
            sentAt,
          },
        })),
      });
    }

    const { data } = await axiosInstance.patch(`/jobOffers/${id}`, {
      fields: { status: "sent", date: sentAt },
    });

    res.status(200).json({ status: "ok", sent: recipients.length, sentAt, jobOffer: data });
  } catch (error) {
    res.status(400).json({ status: "fail", error: getErrorMessage(error) });
  }
};

// GET /api/job-offers/:id/outbox - who got the job offer
export const getJobOfferEmails = async (req: Request, res: Response) => {
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

// GET /api/outbox - every e-mail of the outbox with its job offer's subject, newest first
// (the client counts "last contacted" of every candidate from it)
export const getAllEmails = async (req: Request, res: Response) => {
  try {
    const [emails, jobOffers] = await Promise.all([
      getAllRecords(emailsEndpoint),
      getAllRecords("/jobOffers"),
    ]);
    const subjects = new Map(
      (jobOffers as AirtableRecord<JobOfferFields>[]).map(({ id, fields }) => [id, fields.subject ?? ""])
    );

    const sent = (emails as AirtableRecord<EmailFields>[])
      .filter(({ fields }) => subjects.has(fields.jobOfferId ?? ""))
      .map(({ id, fields }) => ({
        id,
        jobOfferId: fields.jobOfferId,
        candidateId: fields.candidateId,
        subject: subjects.get(fields.jobOfferId ?? ""),
        name: fields.name,
        email: fields.email,
        sentAt: fields.sentAt,
      }))
      .sort(
        (a, b) =>
          (b.sentAt ?? "").localeCompare(a.sentAt ?? "") ||
          (a.name ?? "").localeCompare(b.name ?? "", "pl")
      );

    res.status(200).json(sent);
  } catch (error) {
    res.status(400).json({ status: "fail", error: getErrorMessage(error) });
  }
};

// GET /api/candidates/:id/outbox - the job offers a candidate got, newest first
export const getCandidateEmails = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isRecordId(id)) return res.status(200).json([]);

  try {
    const [emails, jobOffers] = await Promise.all([
      getAllRecords(emailsEndpoint, { filterByFormula: `{candidateId}='${id}'` }),
      getAllRecords("/jobOffers"),
    ]);
    const subjects = new Map(
      (jobOffers as AirtableRecord<JobOfferFields>[]).map(({ id: jobOfferId, fields }) => [
        jobOfferId,
        fields.subject ?? "",
      ])
    );

    const received = (emails as AirtableRecord<EmailFields>[])
      .filter(({ fields }) => fields.candidateId === id && subjects.has(fields.jobOfferId ?? ""))
      .map(({ id: emailId, fields }) => ({
        id: emailId,
        jobOfferId: fields.jobOfferId,
        subject: subjects.get(fields.jobOfferId ?? ""),
        sentAt: fields.sentAt,
      }))
      .sort((a, b) => (b.sentAt ?? "").localeCompare(a.sentAt ?? ""));

    res.status(200).json(received);
  } catch (error) {
    res.status(400).json({ status: "fail", error: getErrorMessage(error) });
  }
};

// GET /api/outbox/:id/preview - the e-mail exactly as its recipient got it
export const getEmailPreview = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data: email } = await axiosInstance.get<AirtableRecord<EmailFields>>(
      `${emailsEndpoint}/${id}`
    );
    const { jobOfferId = "", candidateId = "", name, sentAt } = email.fields;
    const { data: jobOffer } = await axiosInstance.get<AirtableRecord<JobOfferFields>>(
      `/jobOffers/${jobOfferId}`
    );

    // the e-mail uses the name the candidate had when it went out; the outbox keeps no
    // role, so it is the candidate's current one (none when they have been deleted)
    const [firstName, ...surname] = (name ?? "").split(" ");
    const role = isRecordId(candidateId)
      ? await axiosInstance
          .get<AirtableRecord<CandidateFields>>(`/candidates/${candidateId}`)
          .then(({ data }) => data.fields.role ?? "", () => "")
      : "";
    const built = buildEmail({
      jobOffer: jobOffer.fields,
      recipient: { name: firstName, surname: surname.join(" "), email: email.fields.email, role },
      optOutUrl: optOutUrl(appOrigin(req), candidateId),
    });

    res.status(200).json({ ...built, toName: name ?? "", sentAt });
  } catch (error) {
    res.status(404).json({ status: "fail", error: "E-mail does not exist" });
  }
};

// POST /api/job-offers/preview  { subject, message, candidateId }
// a job offer that is being written, as this candidate would get it
export const previewJobOffer = async (req: Request, res: Response) => {
  const { subject = "", message = "", candidateId } = req.body ?? {};
  const jobOffer = { subject: String(subject), message: String(message) };

  const invalidText = placeholderError(jobOffer);
  if (invalidText) return res.status(400).json({ status: "fail", error: invalidText });

  if (!isRecordId(candidateId)) {
    return res.status(404).json({ status: "fail", error: "Candidate does not exist" });
  }

  try {
    const { data: candidate } = await axiosInstance.get<AirtableRecord<CandidateFields>>(
      `/candidates/${candidateId}`
    );
    const { name, surname, email, role } = candidate.fields;
    const built = buildEmail({
      jobOffer,
      recipient: { name, surname, email, role: role },
      optOutUrl: optOutUrl(appOrigin(req), candidateId),
    });

    res.status(200).json({ ...built, toName: fullName(candidate.fields) });
  } catch (error) {
    res.status(404).json({ status: "fail", error: "Candidate does not exist" });
  }
};

// deleting a job offer also empties its outbox
export const deleteJobOfferEmails = async (jobOfferId: string) => {
  if (!isRecordId(jobOfferId)) return;

  const ids = (await emailsOf(jobOfferId)).map(({ id }) => id);

  for (const [i, batch] of chunks(ids).entries()) {
    if (i > 0) await wait(250);
    await axiosInstance.delete(emailsEndpoint, { params: { records: batch } });
  }
};

const candidateFromToken = async (token: unknown) => {
  const candidateId = readOptOutToken(token);
  if (!candidateId) return null;

  const { data } = await axiosInstance.get<AirtableRecord<CandidateFields>>(
    `/candidates/${candidateId}`
  );
  return data;
};

const invalidLink = { status: "fail", error: "This opt-out link is not valid" };

// GET /api/opt-out/:token - public: who the link belongs to (for the confirmation page)
export const getOptOut = async (req: Request, res: Response) => {
  try {
    const candidate = await candidateFromToken(req.params.token);
    if (!candidate) return res.status(404).json(invalidLink);

    res.status(200).json({
      email: candidate.fields.email,
      isOptedOut: candidate.fields.status === "opted out",
    });
  } catch (error) {
    res.status(404).json(invalidLink);
  }
};

// POST /api/opt-out/:token - public: the candidate stops getting job offers
export const postOptOut = async (req: Request, res: Response) => {
  try {
    const candidate = await candidateFromToken(req.params.token);
    if (!candidate) return res.status(404).json(invalidLink);

    // typecast: Airtable adds the "opted out" choice to the status field if it is missing
    await axiosInstance.patch(`/candidates/${candidate.id}`, {
      fields: { status: "opted out" },
      typecast: true,
    });

    res.status(200).json({ status: "ok", email: candidate.fields.email });
  } catch (error) {
    res.status(404).json(invalidLink);
  }
};
