import api from "./api";

// errors are not caught here - react-query sets isError and the QueryCache onError shows a toast
const fetchDataById = async ({ queryKey }) => {
  const [key, { id }] = queryKey;

  return api.get(`${key}/${id}`);
};

export default fetchDataById;
