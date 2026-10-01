import { QueryFunctionContext } from "react-query";

import api from "./api";

export type QueryKeyById = [string, { id?: string }];

// errors are not caught here - react-query sets isError and the QueryCache onError shows a toast
const fetchDataById = async <T>({
  queryKey,
}: QueryFunctionContext<QueryKeyById>): Promise<T> => {
  const [key, { id }] = queryKey;

  return api.get<T>(`${key}/${id}`);
};

export default fetchDataById;
