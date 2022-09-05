import api from "./api";
import { toastMessage } from "helpers";

const fetchDataById = async ({ queryKey }) => {
  const [key, { id }] = queryKey;

  try {
    const response = await api.get(`${key}/${id}`);

    return response;
  } catch (error) {
    toastMessage(`Something wrong - can not get data: ${error.message}`);
  }
};

export default fetchDataById;
