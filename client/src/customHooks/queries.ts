import { useQuery } from "react-query";

import { fetchData, fetchDataById } from "services";
import { QueryKeyById } from "services/fetchDataById";
import { Campaign, Subscriber } from "types";

// typed react-query hooks - one place for the query keys and the data types

export const useSubscribers = (errorMessage?: string) =>
  useQuery<Subscriber[], Error, Subscriber[], string>(
    "/subscribers",
    fetchData,
    { meta: { myMessage: errorMessage } }
  );

export const useCampaigns = (errorMessage?: string) =>
  useQuery<Campaign[], Error, Campaign[], string>("/campaigns", fetchData, {
    meta: { myMessage: errorMessage },
  });

export const useSubscriber = (id?: string, errorMessage?: string) =>
  useQuery<Subscriber, Error, Subscriber, QueryKeyById>(
    ["/subscribers", { id }],
    fetchDataById,
    { meta: { myMessage: errorMessage } }
  );

export const useCampaign = (id?: string, errorMessage?: string) =>
  useQuery<Campaign, Error, Campaign, QueryKeyById>(
    ["/campaigns", { id }],
    fetchDataById,
    { meta: { myMessage: errorMessage } }
  );
