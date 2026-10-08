import api from "./api";
import { Campaign, CampaignFormValues } from "types";

// the server builds and saves an e-mail for every recipient (the outbox), then marks
// the campaign sent; a new campaign is saved as a draft first - it needs an id
const sendCampaign = async ({
  id,
  values: { title, description },
  recipientIds,
}: {
  id?: string;
  values: CampaignFormValues;
  recipientIds: string[];
}) => {
  const fields = { title, description, status: "draft" };
  const draft = id
    ? await api.patch<Campaign>(`/campaigns/${id}`, { fields })
    : await api.post<Campaign>("/campaigns", { fields });

  await api.post(`/campaigns/${draft.id}/send`, { recipientIds });

  return draft.id;
};

export default sendCampaign;
