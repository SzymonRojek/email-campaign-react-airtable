import api from "./api";
import { toastMessage } from "helpers";

const fetchData = async ({ queryKey }) => {
  const [key] = queryKey;

  try {
    const response = await api.get(`${key}`);

    return response;
  } catch (error) {
    toastMessage(`Something wrong - can not get data: ${error.message}`);
  }
};

export default fetchData;
