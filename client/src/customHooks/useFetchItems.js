import { useQuery } from "react-query";

import { fetchData } from "services";

export const useFetchItems = (endpoint, config) => {
  const context = useQuery(endpoint, fetchData, {
    ...config,
  });

  return context;
};
