import React, { useState, useEffect, createContext, useContext } from "react";

import api from "./api";

const APIContext = createContext();

function APIContextProvider({ children }) {
  const [subscribersData, setSubscribersData] = useState({
    status: "loading",
    data: null,
  });

  const [campaignsData, setCampaignsData] = useState({
    status: "loading",
    data: null,
  });

  const fetchSubscribersData = async () => {
    try {
      const data = await api.get("/subscribers");

      setSubscribersData({
        status: data?.error ? "error" : "success",
        data,
      });
    } catch (error) {
      setSubscribersData({
        status: "error",
      });
    }
  };

  useEffect(() => {
    fetchSubscribersData();
  }, []);

  const fetchCampaignsData = async () => {
    try {
      const data = await api.get("/campaigns");

      setCampaignsData({
        status: data?.error ? "error" : "success",
        data,
      });
    } catch (error) {
      setCampaignsData({
        status: "error",
      });
    }
  };

  useEffect(() => {
    fetchCampaignsData();
  }, []);

  const filteredActiveSubscribers = subscribersData.data
    ? subscribersData.data.filter(
        (subscriber) => subscriber.fields.status === "active"
      )
    : [];

  return (
    <APIContext.Provider
      value={{
        subscribersData,
        setSubscribersData,
        fetchSubscribersData,
        campaignsData,
        setCampaignsData,
        fetchCampaignsData,
        filteredActiveSubscribers,
      }}
    >
      {children}
    </APIContext.Provider>
  );
}

export default APIContextProvider;

export const useAPI = () => {
  const context = useContext(APIContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
};
