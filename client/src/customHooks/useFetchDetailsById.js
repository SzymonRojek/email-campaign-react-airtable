import { useEffect, useState } from "react";
import { useErrorHandler } from "react-error-boundary";

import api from "../api";

export const useFetchDetailsById = (endpoint, id) => {
  const [itemData, setItemData] = useState({
    status: "loading",
    data: null,
  });

  // const handleError = useErrorHandler();
  const fetchData = async () => {
    try {
      const data = await api.get(`${endpoint}/${id}`);

      setItemData({
        status: "success",
        data,
      });
    } catch (error) {
      console.log("idError", error);
      // handleError(error);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      setItemData({});
    };
  }, []);

  return { itemData, setItemData };
};
