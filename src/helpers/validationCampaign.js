import * as Yup from "yup";

const validationCampaign = Yup.object().shape({
  title: Yup.string()
    .required("title is required")
    .min(3, "must be at least 3 characters")
    .max(20, "must not exceed 20 characters"),
  description: Yup.string()
    .required("description is required")
    .min(3, "must be at least 3 characters")
    .max(60, "must not exceed 60 characters"),
});

export default validationCampaign;
