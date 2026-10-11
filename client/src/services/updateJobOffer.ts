import api from "./api";
import getErrorMessage from "./getErrorMessage";
import { toastMessage } from "helpers";
import { JobOffer, JobOfferFields, JobOfferFormValues, JobOfferStatus } from "types";

interface UpdateJobOfferConfig {
  data: JobOfferFormValues;
  status: JobOfferStatus;
  id?: string;
  callback: (fields: JobOfferFields, status: JobOfferStatus) => void;
}

const updateJobOffer = async ({
  data: { subject, message },
  status,
  id,
  callback,
}: UpdateJobOfferConfig) => {
  const patchData = {
    fields: {
      subject,
      message,
      status,
    },
  };

  try {
    const response = await api.patch<JobOffer>(`/job-offers/${id}`, patchData);

    callback(response.fields, status);
  } catch (error) {
    toastMessage(
      `Data were not been updated into Airtable: ${getErrorMessage(error)}`
    );
  }
};

export default updateJobOffer;
