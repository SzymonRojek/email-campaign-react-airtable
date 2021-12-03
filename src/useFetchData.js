import { useState, useEffect } from "react";

import api from "./api";

export function useFetchData(endpoint) {
  const [data, setData] = useState({
    status: "loading",
    data: null,
  });

  const getData = async () => {
    if (!endpoint) {
      setData({ status: "error" });
    } else {
      try {
        const { records } = await api.get(endpoint);

        setData({
          status: "success",
          data: records,
        });
      } catch (error) {
        setData({
          status: "error",
        });
      }
    }
  };

  useEffect(() => {
    const timeId = setTimeout(getData, 3_000);

    return () => clearTimeout(timeId);
  }, []);

  return {
    data,
    setData,
    getData,
  };
}

// export function useFetchData(endpointOne, endpointSecond) {
//   const [subscribersData, setSubscribersData] = useState({
//     status: "loading",
//     data: null,
//     latestAddedItem: null,
//   });
//   const [campaignsData, setCampaignsData] = useState({
//     status: "loading",
//     data: null,
//     latestAddedItem: null,
//   });
//   const subscribersUrl = "/subscribers";
//   const campaignsUrl = "/campaigns";

//   const getSubscribersData = async () => {
//     if (endpointOne !== subscribersUrl) setSubscribersData({ status: "error" });

//     if (endpointOne === subscribersUrl) {
//       try {
//         const { records } = await api.get(endpointOne);

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
//     }
//   };

//   useEffect(() => {
//     const timeId = setInterval(() => getSubscribersData(), 3_000);

//     return () => clearInterval(timeId);
//   }, []);

//   const getCampaignsData = async () => {
//     if (endpointSecond !== campaignsUrl) setCampaignsData({ status: "error" });

//     if (endpointSecond === campaignsUrl) {
//       try {
//         const { records } = await api.get(endpointSecond);

//         sortDataAlphabetically(records);

//         setCampaignsData({
//           status: "success",
//           data: records,
//           latestAddedItem: getLatestAddedItem(records),
//         });
//       } catch (error) {
//         setCampaignsData({
//           status: "error",
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     const timeId = setTimeout(() => getCampaignsData(), 3_000);

//     return () => clearTimeout(timeId);
//   }, []);

//   return [
//     {
//       subscribersData,
//       campaignsData,
//       setSubscribersData,
//       setCampaignsData,
//     },
//     getSubscribersData,
//     getCampaignsData,
//   ];
// }
