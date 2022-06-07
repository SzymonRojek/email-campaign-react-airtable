import { useQuery } from "react-query";

import api from "api";

export const useFetchItems = (endpoint, config) => {
  const context = useQuery(endpoint, api.fetchItems, {
    ...config,
  });

  return context;
};
