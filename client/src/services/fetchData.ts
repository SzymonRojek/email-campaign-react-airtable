import { QueryFunctionContext } from "@tanstack/react-query";

import api from "./api";

export type QueryKey = [string];

// errors are not caught here - react-query sets isError and the QueryCache onError shows a toast
const fetchData = async <T>({
  queryKey,
}: QueryFunctionContext<QueryKey>): Promise<T> => {
  const [key] = queryKey;

  return api.get<T>(key);
};

export default fetchData;
