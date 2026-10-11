import api from "./api";
import { JobOffer, JobOfferFormValues } from "types";

// the server builds and saves an e-mail for every recipient (the outbox), then marks
// the job offer sent; a new job offer is saved as a draft first - it needs an id
const sendJobOffer = async ({
  id,
  values: { subject, message },
  recipientIds,
}: {
  id?: string;
  values: JobOfferFormValues;
  recipientIds: string[];
}) => {
  const fields = { subject, message, status: "draft" };
  const draft = id
    ? await api.patch<JobOffer>(`/job-offers/${id}`, { fields })
    : await api.post<JobOffer>("/job-offers", { fields });

  await api.post(`/job-offers/${draft.id}/send`, { recipientIds });

  return draft.id;
};

export default sendJobOffer;
