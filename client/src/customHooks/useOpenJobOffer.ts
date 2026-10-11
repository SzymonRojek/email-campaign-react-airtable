import { MouseEvent } from "react";
import { useNavigate } from "react-router";

import { isInteractiveClick } from "helpers";
import { JobOffer } from "types";

// where a job offer opens: a draft in the editor (like the drafts in an e-mail app),
// a sent one on its page with the recipients
export const jobOfferPath = ({ id, fields }: JobOffer) =>
  fields.status === "draft" ? `/job-offers/edit/${id}` : `/job-offers/${id}`;

// a click anywhere in a job offer's row opens it
export const useOpenJobOffer = (jobOffer: JobOffer) => {
  const navigate = useNavigate();

  return (event: MouseEvent) => {
    if (!isInteractiveClick(event)) navigate(jobOfferPath(jobOffer));
  };
};
