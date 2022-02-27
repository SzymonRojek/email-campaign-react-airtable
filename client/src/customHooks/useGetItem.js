import { useQuery } from "react-query";
import api from "api";

export default function useGetItem(endpoint, id) {
  const getItemById = async () => {
    const data = await api.get(`${endpoint}/${id}`);

    return data;
  };
  return useQuery(["subscriber", id], getItemById);
}
