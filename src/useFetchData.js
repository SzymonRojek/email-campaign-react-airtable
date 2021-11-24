import { useState, useCallback, useRef } from "react";

import api from "./api";
import { sortDataAlphabetically, getLatestAddedItem } from "./helpers";

export function useFetchData(endpointOne, endpointSecond) {
  const isCalledRefSubscribers = useRef(false);
  const isCalledRefCampaigns = useRef(false);
  const [subscribersData, setSubscribersData] = useState({
    status: "loading",
    data: null,
    latestAddedItem: null,
  });
  const [campaignsData, setCampaignsData] = useState({
    status: "loading",
    data: null,
    latestAddedItem: null,
  });
  const subscribersUrl = "/subscribers";
  const campaignsUrl = "/campaigns";

  const refetchSubscribersData = useCallback(() => {
    const fetchData = async () => {
      if (endpointOne !== subscribersUrl)
        setSubscribersData({ status: "error" });
      if (endpointSecond !== campaignsUrl)
        setCampaignsData({ status: "error" });

      if (endpointOne === subscribersUrl) {
        try {
          const { records } = await api.get(endpointOne);

          sortDataAlphabetically(records);

          setSubscribersData({
            status: "success",
            data: records,
            latestAddedItem: getLatestAddedItem(records),
          });

          if (subscribersData.status !== "success")
            isCalledRefSubscribers.current = true;
        } catch (error) {
          setSubscribersData({
            status: "error",
          });
        }
      }
    };

    if (!isCalledRefSubscribers.current) fetchData();
  }, [endpointOne]);

  const refetchCampaignsData = useCallback(() => {
    const fetchData = async () => {
      if (endpointSecond !== campaignsUrl)
        setCampaignsData({ status: "error" });

      if (endpointSecond === campaignsUrl) {
        try {
          const { records } = await api.get(endpointSecond);

          sortDataAlphabetically(records);

          setCampaignsData({
            status: "success",
            data: records,
            latestAddedItem: getLatestAddedItem(records),
          });

          isCalledRefCampaigns.current = true;
        } catch (error) {
          setCampaignsData({
            status: "error",
          });
        }
      }
    };

    if (!isCalledRefCampaigns.current) fetchData();
  }, [endpointSecond]);

  return [
    {
      subscribersData,
      campaignsData,
      setSubscribersData,
      setCampaignsData,
      isCalledRefSubscribers,
      isCalledRefCampaigns,
    },
    refetchSubscribersData,
    refetchCampaignsData,
  ];
}
