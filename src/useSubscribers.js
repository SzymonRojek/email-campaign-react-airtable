import { useState, useEffect } from "react";

import api from "./api";
import { sortDataAlphabetically, getLatestAddedItem } from "./helpers";

export const useSubscribers = (endpoint) => {
  const [subscribersData, setSubscribersData] = useState({
    status: "loading",
    data: null,
    latestAddedItem: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { records } = await api.get(endpoint);

        sortDataAlphabetically(records);

        setSubscribersData({
          status: "success",
          data: records,
          latestAddedItem: getLatestAddedItem(records),
        });
      } catch (error) {
        setSubscribersData({
          status: "error",
        });
      }
    };

    const delayFetchData = setTimeout(fetchData, 1000);

    return () => clearTimeout(delayFetchData);
  }, [endpoint]);

  return { subscribersData, setSubscribersData };
};
