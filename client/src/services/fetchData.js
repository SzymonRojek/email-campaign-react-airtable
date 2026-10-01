import api from "./api";

// errors are not caught here - react-query sets isError and the QueryCache onError shows a toast
const fetchData = async ({ queryKey }) => {
  const [key] = queryKey;

  return api.get(`${key}`);
};

export default fetchData;
