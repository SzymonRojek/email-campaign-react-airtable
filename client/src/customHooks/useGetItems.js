import { useQuery } from "react-query";

import api from "api";

export default function useGetItems(endpoint) {
  const getItems = async () => {
    const data = await api.get(endpoint);

    return data;
  };

  return useQuery("subscribers", () => getItems);
}
