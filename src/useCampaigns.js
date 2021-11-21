import { useState, useEffect } from "react";

import api from "./api";
import { sortDataAlphabetically, getLatestAddedItem } from "./helpers";

export const useCampaigns = (endpoint) => {
  const [campaignsData, setCampaignsData] = useState({
    status: "loading",
    data: null,
    latestAddedItem: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { records } = await api.get(endpoint);

        sortDataAlphabetically(records);

        setCampaignsData({
          status: "success",
          data: records,
          latestAddedItem: getLatestAddedItem(records),
        });
      } catch (error) {
        setCampaignsData({
          status: "error",
        });
      }
    };

    const delayFetchData = setTimeout(fetchData, 1000);

    return () => clearTimeout(delayFetchData);
  }, [endpoint]);

  return { campaignsData, setCampaignsData };
};
