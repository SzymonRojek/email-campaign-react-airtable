import React, { useState, useEffect, createContext, useContext } from "react";

import api from "../api";
import { useErrorHandler } from "react-error-boundary";

const APIcontext = createContext();

export const APIcontextProvider = ({ children }) => {
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

  const contextValues = {
    subscribersData,
    setSubscribersData,
    fetchSubscribersData,
    campaignsData,
    setCampaignsData,
    fetchCampaignsData,
  };

  return (
    <APIcontext.Provider value={contextValues}>{children}</APIcontext.Provider>
  );
};

export const useAPIcontext = () => {
  const context = useContext(APIcontext);
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context;
};
