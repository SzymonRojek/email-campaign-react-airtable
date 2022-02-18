import React, { useState, useEffect, createContext, useContext } from "react";

import api from "./api";
import { useErrorHandler } from "react-error-boundary";

const APIContext = createContext();

const APIContextProvider = ({ children }) => {
  const [subscribersData, setSubscribersData] = useState({
    status: "loading",
    data: null,
  });

  const [campaignsData, setCampaignsData] = useState({
    status: "loading",
    data: null,
  });

  const handleError = useErrorHandler();

  const fetchSubscribersData = async () => {
    try {
      const data = await api.get("/subscribers");

      setSubscribersData({
        status: "success",
        data,
      });
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchSubscribersData();

    return () => {
      setSubscribersData({});
    };
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

    return () => {
      setCampaignsData({});
    };
  }, []);

  const filteredActiveSubscribers = subscribersData?.subscribers
    ? subscribersData.subscribers.filter(
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
};

export default APIContextProvider;

export const useAPI = () => {
  const context = useContext(APIContext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
};
