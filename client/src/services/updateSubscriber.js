import api from "./api";
import { toastMessage } from "helpers";

const updateSubscriber = async ({
  data: { name, surname, email, profession, status, salary, telephone },
  id,
  callback,
}) => {
  const patchData = {
    fields: {
      name,
      email,
      surname,
      status,
      salary,
      telephone,
      profession,
    },
  };

  try {
    const response = await api.patch(`/subscribers/${id}`, patchData);

    callback(response.fields);
  } catch (error) {
    toastMessage(`Data were not been updated into Airtable: ${error.message}`);
  }
};

export default updateSubscriber;
