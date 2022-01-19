import * as Yup from "yup";

const validationCampaign = Yup.object().shape({
  title: Yup.string()
    .required("title is required")
    .trim()
    .min(3, "must be at least 3 characters")
    .max(30, "must not exceed 30 characters"),
  description: Yup.string()
    .required("description is required")
    .trim()
    .min(3, "must be at least 3 characters")
    .max(100, "must not exceed 100 characters"),
});

export default validationCampaign;
