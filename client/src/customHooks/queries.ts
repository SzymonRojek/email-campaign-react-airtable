import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchData, fetchDataById } from "services";
import api from "services/api";
import {
  Campaign,
  CampaignFormValues,
  Email,
  EmailPreview,
  Feedback,
  ReceivedEmail,
  Subscriber,
} from "types";

// typed react-query hooks - one place for the query keys and the data types

export const subscribersKey = ["/subscribers"] as [string];
export const campaignsKey = ["/campaigns"] as [string];

export const useSubscribers = (errorMessage?: string) =>
  useQuery({
    queryKey: subscribersKey,
    queryFn: fetchData<Subscriber[]>,
    meta: { myMessage: errorMessage },
  });

export const useCampaigns = (errorMessage?: string) =>
  useQuery({
    queryKey: campaignsKey,
    queryFn: fetchData<Campaign[]>,
    meta: { myMessage: errorMessage },
  });

export const useSubscriber = (id?: string, errorMessage?: string) =>
  useQuery({
    queryKey: ["/subscribers", { id }] as [string, { id?: string }],
    queryFn: fetchDataById<Subscriber>,
    meta: { myMessage: errorMessage },
  });

export const useCampaign = (id?: string, errorMessage?: string) =>
  useQuery({
    queryKey: ["/campaigns", { id }] as [string, { id?: string }],
    queryFn: fetchDataById<Campaign>,
    meta: { myMessage: errorMessage },
  });

// the outbox of a sent campaign - who got it
export const useCampaignEmails = (id?: string) =>
  useQuery({
    queryKey: ["/campaigns", { id }, "emails"],
    queryFn: () => api.get<Email[]>(`/campaigns/${id}/emails`),
    enabled: Boolean(id),
  });

// the campaigns a subscriber got
export const useSubscriberEmails = (id?: string) =>
  useQuery({
    queryKey: ["/subscribers", { id }, "emails"],
    queryFn: () => api.get<ReceivedEmail[]>(`/subscribers/${id}/emails`),
    enabled: Boolean(id),
  });

// one e-mail as its recipient got it
export const useEmailPreview = (id: string | null) =>
  useQuery({
    queryKey: ["/emails", { id }, "preview"],
    queryFn: () => api.get<EmailPreview>(`/emails/${id}/preview`),
    enabled: Boolean(id),
    // a sent e-mail never changes
    staleTime: Infinity,
  });

// a campaign that is being written, as one subscriber would get it
// (its own key - refreshing the campaigns list does not load it again)
export const useCampaignPreview = (values: CampaignFormValues | null, subscriberId?: string) =>
  useQuery({
    queryKey: ["campaign-preview", values, subscriberId],
    queryFn: () => api.post<EmailPreview>("/campaigns/preview", { ...values, subscriberId }),
    enabled: Boolean(values && subscriberId),
    // switching the recipient keeps the last e-mail on screen until the next one is ready
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

// public: the approved feedback (the login page shows it too) - an extra, so no toast
export const useFeedback = () =>
  useQuery({
    queryKey: ["/feedback"],
    queryFn: () => api.get<Feedback[]>("/feedback"),
    staleTime: 5 * 60 * 1000,
    meta: { silent: true },
  });
