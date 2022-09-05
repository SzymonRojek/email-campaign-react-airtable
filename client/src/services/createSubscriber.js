import api from "./api";
import { capitalizeFirstLetter, toastMessage } from "helpers";

const createSubscriber = async ({
  data: { name, surname, email, status, profession, salary, telephone },
  callback,
}) => {
  const postData = {
    fields: {
      name: capitalizeFirstLetter(name),
      surname: capitalizeFirstLetter(surname),
      email,
      status,
      profession,
      salary,
      telephone,
    },
  };

  try {
    const response = await api.post("/subscribers", postData);

    callback(response.fields);
  } catch (error) {
    toastMessage(`Data were not been sent to the Airtable: ${error.message}`);
  }
};

export default createSubscriber;
