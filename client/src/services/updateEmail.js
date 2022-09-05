import api from "./api";
import { toastMessage } from "helpers";

const updateEmail = async ({
  data: { title, description },
  status,
  id,
  callback,
}) => {
  const patchData = {
    fields: {
      title,
      description,
      status,
    },
  };

  try {
    const response = await api.patch(`/campaigns/${id}`, patchData);

    callback(response.fields, status);
  } catch (error) {
    toastMessage(`Data were not been updated into Airtable: ${error.message}`);
  }
};

export default updateEmail;
