import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchData, fetchDataById } from "services";
import api from "services/api";
import {
  JobOffer,
  JobOfferFormValues,
  Email,
  EmailPreview,
  Feedback,
  ReceivedEmail,
  SentEmail,
  Candidate,
} from "types";

// typed react-query hooks - one place for the query keys and the data types

export const candidatesKey = ["/candidates"] as [string];
export const jobOffersKey = ["/job-offers"] as [string];
export const outboxKey = ["/outbox"];

export const useCandidates = (errorMessage?: string) =>
  useQuery({
    queryKey: candidatesKey,
    queryFn: fetchData<Candidate[]>,
    meta: { myMessage: errorMessage },
  });

export const useJobOffers = (errorMessage?: string) =>
  useQuery({
    queryKey: jobOffersKey,
    queryFn: fetchData<JobOffer[]>,
    meta: { myMessage: errorMessage },
  });

export const useCandidate = (id?: string, errorMessage?: string) =>
  useQuery({
    queryKey: ["/candidates", { id }] as [string, { id?: string }],
    queryFn: fetchDataById<Candidate>,
    meta: { myMessage: errorMessage },
  });

export const useJobOffer = (id?: string, errorMessage?: string) =>
  useQuery({
    queryKey: ["/job-offers", { id }] as [string, { id?: string }],
    queryFn: fetchDataById<JobOffer>,
    meta: { myMessage: errorMessage },
  });

// the outbox of a sent job offer - who got it
export const useJobOfferEmails = (id?: string) =>
  useQuery({
    queryKey: ["/job-offers", { id }, "emails"],
    queryFn: () => api.get<Email[]>(`/job-offers/${id}/outbox`),
    enabled: Boolean(id),
  });

// every e-mail of every sent job offer - "last contacted" of the candidates
export const useOutbox = () =>
  useQuery({
    queryKey: outboxKey,
    queryFn: () => api.get<SentEmail[]>("/outbox"),
    meta: { myMessage: "Cannot get the sent e-mails." },
  });

// the job offers a candidate got
export const useCandidateEmails = (id?: string) =>
  useQuery({
    queryKey: ["/candidates", { id }, "emails"],
    queryFn: () => api.get<ReceivedEmail[]>(`/candidates/${id}/outbox`),
    enabled: Boolean(id),
  });

// one e-mail as its recipient got it
export const useEmailPreview = (id: string | null) =>
  useQuery({
    queryKey: ["/outbox", { id }, "preview"],
    queryFn: () => api.get<EmailPreview>(`/outbox/${id}/preview`),
    enabled: Boolean(id),
    // a sent e-mail never changes
    staleTime: Infinity,
  });

// a job offer that is being written, as one candidate would get it
// (its own key - refreshing the job offers list does not load it again)
export const useJobOfferPreview = (values: JobOfferFormValues | null, candidateId?: string) =>
  useQuery({
    queryKey: ["jobOffer-preview", values, candidateId],
    queryFn: () => api.post<EmailPreview>("/job-offers/preview", { ...values, candidateId }),
    enabled: Boolean(values && candidateId),
    // switching the recipient keeps the last e-mail on screen until the next one is ready
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

// public: the approved feedback (the login page shows it too) - an extra, so no toast
export const useFeedback = () =>
  useQuery({
    queryKey: ["/feedback"],
    queryFn: () => api.get<Feedback[]>("/feedback"),
    // loaded again on every visit - an approved entry shows up at once
    meta: { silent: true },
  });
