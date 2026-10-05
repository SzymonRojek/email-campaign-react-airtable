import api from "./api";
import getErrorMessage from "./getErrorMessage";
import { toastMessage } from "helpers";
import { Campaign, CampaignFields, CampaignFormValues, CampaignStatus } from "types";

interface CreateEmailConfig {
  data: CampaignFormValues;
  status: CampaignStatus;
  callback: (fields: CampaignFields, status: CampaignStatus) => void;
}

const createEmail = async ({
  data: { title, description },
  status,
  callback,
}: CreateEmailConfig) => {
  const postData = {
    fields: {
      title,
      description,
      status,
    },
  };

  try {
    const response = await api.post<Campaign>("/campaigns", postData);

    callback(response.fields, status);
  } catch (error) {
    toastMessage(
      `Data were not been sent to the Airtable: ${getErrorMessage(error)}`
    );
  }
};

export default createEmail;
