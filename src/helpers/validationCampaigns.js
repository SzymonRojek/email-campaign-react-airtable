import * as Yup from "yup";

const validationCampaign = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(20, "Title must not exceed 20 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(3, "Description must be at least 3 characters")
    .max(60, "Description must not exceed 60 characters"),
});

export default validationCampaign;
