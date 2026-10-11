import crypto from "crypto";

import { safeEqual } from "../helpers/authToken";

// "<candidate id>.<signature>" - the opt-out link can not be guessed or changed
// to another candidate; signed with AUTH_SECRET (with its own purpose, so a login
// token can never pass as an opt-out token or the other way round)
const sign = (candidateId: string) =>
  crypto
    .createHmac("sha256", `opt-out:${process.env.AUTH_SECRET}`)
    .update(candidateId)
    .digest("base64url");

export const createOptOutToken = (candidateId: string) =>
  `${candidateId}.${sign(candidateId)}`;

// the candidate id, or null for a wrong / changed token
export const readOptOutToken = (token: unknown) => {
  const [candidateId, signature, ...rest] = String(token).split(".");

  if (!process.env.AUTH_SECRET || !candidateId || !signature || rest.length) return null;

  return safeEqual(signature, sign(candidateId)) ? candidateId : null;
};

// the public page of the app: /#/opt-out/<token>
export const optOutUrl = (appOrigin: string, candidateId: string) =>
  `${appOrigin}/#/opt-out/${createOptOutToken(candidateId)}`;
