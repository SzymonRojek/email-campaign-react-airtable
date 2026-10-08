import { useQuery } from "@tanstack/react-query";

import { fetchData, fetchDataById } from "services";
import api from "services/api";
import { Campaign, Email, EmailPreview, Subscriber } from "types";

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

// one e-mail as its recipient got it
export const useEmailPreview = (id: string | null) =>
  useQuery({
    queryKey: ["/emails", { id }, "preview"],
    queryFn: () => api.get<EmailPreview>(`/emails/${id}/preview`),
    enabled: Boolean(id),
    // a sent e-mail never changes
    staleTime: Infinity,
  });
