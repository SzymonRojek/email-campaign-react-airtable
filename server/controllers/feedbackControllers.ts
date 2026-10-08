import { Request, Response } from "express";

import { axiosInstance } from "./axiosInstance";
import { getAllRecords } from "../helpers/getAllRecords";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { AirtableRecord, FeedbackFields } from "../types";

// feedback from the people who review the project - public (no login): the login page
// shows it too; a new entry is shown only after the owner approves it in Airtable
const endpoint = "/feedback";

export const FEEDBACK_LIMITS = { name: 40, role: 40, message: 500 };
const MAX_PER_HOUR = 3;
const HOUR_MS = 60 * 60 * 1000;
// every visit of the login page asks for it - a short memory protects the Airtable API
// limit from bursts (e.g. many refreshes), and an approved entry still shows up at once
const CACHE_MS = 30 * 1000;

interface PublicFeedback {
  id: string;
  name: string;
  role: string;
  message: string;
  date: string;
}

let cache: { savedAt: number; feedback: PublicFeedback[] } | null = null;
// ip -> the times of the feedback sent in the last hour
const sentAt = new Map<string, number[]>();

// only for tests
export const resetFeedbackState = () => {
  cache = null;
  sentAt.clear();
};

// GET /api/feedback - the approved feedback its authors let show, newest first
export const getFeedback = async (req: Request, res: Response) => {
  if (cache && Date.now() - cache.savedAt < CACHE_MS) {
    return res.status(200).json(cache.feedback);
  }

  try {
    const records = (await getAllRecords(endpoint, {
      filterByFormula: "AND({approved}, {isPublic})",
    })) as AirtableRecord<FeedbackFields>[];

    const feedback = records
      .filter(({ fields }) => fields.approved && fields.isPublic && fields.message)
      .map(({ id, createdTime, fields }) => ({
        id,
        name: fields.name ?? "",
        role: fields.role ?? "",
        message: fields.message ?? "",
        date: fields.date || createdTime,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    cache = { savedAt: Date.now(), feedback };
    res.status(200).json(feedback);
  } catch (error) {
    // Airtable is down - the last known feedback is better than nothing
    if (cache) return res.status(200).json(cache.feedback);
    res.status(400).json({ status: "fail", error: getErrorMessage(error) });
  }
};

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const validationError = ({ name, role, message }: Record<string, string>) => {
  if (!name) return "name is required";
  if (name.length > FEEDBACK_LIMITS.name) return `name must not exceed ${FEEDBACK_LIMITS.name} characters`;
  if (role.length > FEEDBACK_LIMITS.role) return `role must not exceed ${FEEDBACK_LIMITS.role} characters`;
  if (message.length < 3) return "the feedback must be at least 3 characters";
  if (message.length > FEEDBACK_LIMITS.message) {
    return `the feedback must not exceed ${FEEDBACK_LIMITS.message} characters`;
  }
  return null;
};

// POST /api/feedback  { name, role?, message, isPublic, website? }
// saved for a review - never shown before the owner approves it
export const createFeedback = async (req: Request, res: Response) => {
  const body = req.body ?? {};

  // "website" is hidden from people - only a bot fills it in; it gets an "ok", nothing is saved
  if (text(body.website)) return res.status(201).json({ status: "ok" });

  const fields = { name: text(body.name), role: text(body.role), message: text(body.message) };
  const error = validationError(fields);
  if (error) return res.status(400).json({ status: "fail", error });

  const ip = req.ip ?? "";
  const recent = (sentAt.get(ip) ?? []).filter((time) => Date.now() - time < HOUR_MS);
  if (recent.length >= MAX_PER_HOUR) {
    return res.status(429).json({
      status: "fail",
      error: "Thank you - you have sent enough feedback for now, please try again later",
    });
  }

  try {
    await axiosInstance.post(endpoint, {
      fields: {
        ...fields,
        isPublic: body.isPublic === true,
        approved: false,
        date: new Date().toISOString(),
      },
    });

    sentAt.set(ip, [...recent, Date.now()]);
    res.status(201).json({ status: "ok" });
  } catch (error) {
    res.status(400).json({ status: "fail", error: getErrorMessage(error) });
  }
};
