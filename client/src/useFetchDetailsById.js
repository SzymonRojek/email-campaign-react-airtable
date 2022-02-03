import { useEffect, useState } from "react";

import api from "./api";

export const useFetchDetailsById = (endpoint, id) => {
  const [itemData, setItemData] = useState({
    status: "loading",
    data: null,
  });

  const fetchData = async () => {
    try {
      const data = await api.get(`${endpoint}/${id}`);

      setItemData({
        status: "success",
        data,
      });
    } catch (error) {
      setItemData({
        status: "error",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { itemData, setItemData };
};
