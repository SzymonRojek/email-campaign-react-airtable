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
