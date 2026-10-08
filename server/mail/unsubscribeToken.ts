import crypto from "crypto";

import { safeEqual } from "../helpers/authToken";

// "<subscriber id>.<signature>" - the unsubscribe link can not be guessed or changed
// to another subscriber; signed with AUTH_SECRET (with its own purpose, so a login
// token can never pass as an unsubscribe token or the other way round)
const sign = (subscriberId: string) =>
  crypto
    .createHmac("sha256", `unsubscribe:${process.env.AUTH_SECRET}`)
    .update(subscriberId)
    .digest("base64url");

export const createUnsubscribeToken = (subscriberId: string) =>
  `${subscriberId}.${sign(subscriberId)}`;

// the subscriber id, or null for a wrong / changed token
export const readUnsubscribeToken = (token: unknown) => {
  const [subscriberId, signature, ...rest] = String(token).split(".");

  if (!process.env.AUTH_SECRET || !subscriberId || !signature || rest.length) return null;

  return safeEqual(signature, sign(subscriberId)) ? subscriberId : null;
};

// the public page of the app: /#/unsubscribe/<token>
export const unsubscribeUrl = (appOrigin: string, subscriberId: string) =>
  `${appOrigin}/#/unsubscribe/${createUnsubscribeToken(subscriberId)}`;
