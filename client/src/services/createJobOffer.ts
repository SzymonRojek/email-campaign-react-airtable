import api from "./api";
import getErrorMessage from "./getErrorMessage";
import { toastMessage } from "helpers";
import { JobOffer, JobOfferFields, JobOfferFormValues, JobOfferStatus } from "types";

interface CreateJobOfferConfig {
  data: JobOfferFormValues;
  status: JobOfferStatus;
  callback: (fields: JobOfferFields, status: JobOfferStatus) => void;
}

const createJobOffer = async ({
  data: { subject, message },
  status,
  callback,
}: CreateJobOfferConfig) => {
  const postData = {
    fields: {
      subject,
      message,
      status,
    },
  };

  try {
    const response = await api.post<JobOffer>("/job-offers", postData);

    callback(response.fields, status);
  } catch (error) {
    toastMessage(
      `Data were not been sent to the Airtable: ${getErrorMessage(error)}`
    );
  }
};

export default createJobOffer;
