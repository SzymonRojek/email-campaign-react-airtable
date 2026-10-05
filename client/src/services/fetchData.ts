import { QueryFunctionContext } from "react-query";

import api from "./api";

// errors are not caught here - react-query sets isError and the QueryCache onError shows a toast
const fetchData = async <T>({
  queryKey,
}: QueryFunctionContext<string>): Promise<T> => {
  const [key] = queryKey;

  return api.get<T>(key);
};

export default fetchData;
