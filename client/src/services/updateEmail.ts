import api from "./api";
import getErrorMessage from "./getErrorMessage";
import { toastMessage } from "helpers";
import { Campaign, CampaignFields, CampaignFormValues, CampaignStatus } from "types";

interface UpdateEmailConfig {
  data: CampaignFormValues;
  status: CampaignStatus;
  id?: string;
  callback: (fields: CampaignFields, status: CampaignStatus) => void;
}

const updateEmail = async ({
  data: { title, description },
  status,
  id,
  callback,
}: UpdateEmailConfig) => {
  const patchData = {
    fields: {
      title,
      description,
      status,
    },
  };

  try {
    const response = await api.patch<Campaign>(`/campaigns/${id}`, patchData);

    callback(response.fields, status);
  } catch (error) {
    toastMessage(
      `Data were not been updated into Airtable: ${getErrorMessage(error)}`
    );
  }
};

export default updateEmail;
