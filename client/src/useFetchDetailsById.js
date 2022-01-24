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
    const delayGetData = setTimeout(fetchData, 2_000);

    return () => clearTimeout(delayGetData);
  }, [id]);

  return { itemData, setItemData };
};
