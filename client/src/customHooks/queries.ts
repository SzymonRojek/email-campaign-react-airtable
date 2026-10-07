import { useQuery } from "@tanstack/react-query";

import { fetchData, fetchDataById } from "services";
import { Campaign, Subscriber } from "types";

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
