import { useEffect, useState } from "react";

import api from "./api";

export const useFetchDetailsById = (endpoint) => {
  const [itemData, setItemData] = useState({
    status: "loading",
    data: null,
  });

  const fetchData = async () => {
    try {
      const data = await api.get(endpoint);

      setItemData({ status: "success", data });
    } catch (error) {
      setItemData({ status: "error" });
    }
  };

  useEffect(() => {
    const delayGetData = setTimeout(fetchData, 200);

    return () => clearTimeout(delayGetData);
  }, []);

  return { itemData, setItemData };
};
