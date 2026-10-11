import { SentEmail } from "types";
import formattedData from "./formattedData";

// a candidate who got a job offer this recently is not sent another one by default
export const RECENT_CONTACT_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;

// candidate id -> when they got their newest job offer
export const lastContactedByCandidate = (emails: SentEmail[]) => {
  const newest = new Map<string, string>();

  for (const { candidateId, sentAt } of emails) {
    if (!candidateId || !sentAt) continue;
    const known = newest.get(candidateId);
    if (!known || sentAt > known) newest.set(candidateId, sentAt);
  }

  return newest;
};

// whole days, counted by the calendar - "yesterday" even when it was 20 hours ago
export const daysSince = (date: string, now = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  return Math.round((today.getTime() - start.getTime()) / DAY_MS);
};

export const isRecentlyContacted = (date: string | undefined, now = new Date()) =>
  Boolean(date) && daysSince(date as string, now) < RECENT_CONTACT_DAYS;

// "today", "yesterday", "5 days ago" - and the date itself after a month
export const contactedAgo = (date: string, now = new Date()) => {
  const days = daysSince(date, now);

  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days <= 30) return `${days} days ago`;
  return formattedData.getFormattedDate(date);
};
