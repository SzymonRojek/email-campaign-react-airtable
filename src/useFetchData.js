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

  const refetchData = useCallback(() => {
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

          isCalledRefSubscribers.current = true;
        } catch (error) {
          setSubscribersData({
            status: "error",
          });
        }
      }

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

    if (!isCalledRefSubscribers.current || !isCalledRefCampaigns.current)
      fetchData();
  }, [endpointOne, endpointSecond]);

  return [
    {
      subscribersData,
      campaignsData,
      setSubscribersData,
      setCampaignsData,
      isCalledRefSubscribers,
      isCalledRefCampaigns,
    },
    refetchData,
  ];
}

// export const useSubscribers = (endpoint) => {
//   const [susbcribersData, setSubscribersData] = useState({
//     status: "loading",
//     data: null,
//     latestAddedItem: null,
//   });

//   useEffect(() => {
//     if (!endpoint) return;

//     const fetchData = async () => {
//       try {
//         const { records } = await api.get(endpoint);

//         sortDataAlphabetically(records);

//         setSubscribersData({
//           status: "success",
//           data: records,
//           latestAddedItem: getLatestAddedItem(records),
//         });
//       } catch (error) {
//         setSubscribersData({
//           status: "error",
//         });
//       }
//     };

//     const delayFetchData = setTimeout(fetchData, 1000);

//     return () => clearTimeout(delayFetchData);
//   }, [endpoint]);

//   return { subscribersData, setSubscribersData };
// };
