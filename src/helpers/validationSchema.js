import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .matches(/^[aA-zZ\s]+$/, "Only letters are required")
    .min(3, "Name must be at least 6 characters")
    .max(10, "Name must not exceed 10 characters"),
  surname: Yup.string()
    .required("Surname is required")
    .matches(/^[aA-zZ\s]+$/, "Only letters are required")
    .min(3, "Surname must be at least 6 characters")
    .max(10, "Surname must not exceed 10 characters"),
  email: Yup.string().required("Email is required").email("Email is invalid"),
});
export default validationSchema;
