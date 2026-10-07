import api from "./api";
import getErrorMessage from "./getErrorMessage";
import { toastMessage } from "helpers";
import { Subscriber, SubscriberFields, SubscriberFormValues } from "types";

interface CreateSubscriberConfig {
  data: SubscriberFormValues;
  callback: (fields: SubscriberFields) => void;
}

const createSubscriber = async ({
  data: { name, surname, email, status, profession, salary, telephone },
  callback,
}: CreateSubscriberConfig) => {
  const postData = {
    fields: {
      name,
      surname,
      email,
      status,
      profession,
      salary,
      telephone,
    },
  };

  try {
    const response = await api.post<Subscriber>("/subscribers", postData);

    callback(response.fields);
  } catch (error) {
    toastMessage(
      `The subscriber has not been added: ${getErrorMessage(error)}`
    );
  }
};

export default createSubscriber;
