import api from "./api";
import { toastMessage } from "helpers";

const createEmail = async ({
  data: { title, description },
  status,
  callback,
}) => {
  const postData = {
    fields: {
      title,
      description,
      status,
    },
  };

  try {
    const response = await api.post("/campaigns", postData);

    callback(response.fields, status);
  } catch (error) {
    toastMessage(`Data were not been sent to the Airtable: ${error.message}`);
  }
};

export default createEmail;
