import { useState, useEffect } from "react";

import api from "./api";

export function useFetchData(endpoint) {
  const [data, setData] = useState({
    status: "loading",
    data: null,
  });

  const getData = async () => {
    try {
      const data = await api.get(endpoint);

      setData({
        status: data?.error ? "error" : "success",
        data,
      });
    } catch (error) {
      setData({
        status: "error",
      });
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
