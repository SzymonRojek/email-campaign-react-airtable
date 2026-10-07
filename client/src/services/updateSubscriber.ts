import api from "./api";
import getErrorMessage from "./getErrorMessage";
import { toastMessage } from "helpers";
import { Subscriber, SubscriberFields, SubscriberFormValues } from "types";

interface UpdateSubscriberConfig {
  data: SubscriberFormValues;
  id?: string;
  callback: (fields: SubscriberFields) => void;
}

const updateSubscriber = async ({
  data: { name, surname, email, profession, status, salary, telephone },
  id,
  callback,
}: UpdateSubscriberConfig) => {
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
    const response = await api.patch<Subscriber>(
      `/subscribers/${id}`,
      patchData
    );

    callback(response.fields);
  } catch (error) {
    toastMessage(
      `The subscriber has not been saved: ${getErrorMessage(error)}`
    );
  }
};

export default updateSubscriber;
