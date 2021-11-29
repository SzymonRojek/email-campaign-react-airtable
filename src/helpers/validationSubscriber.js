import * as Yup from "yup";

const basicSubscriberInformation = {
  name: Yup.string()
    .required("Name is required")
    .matches(/^[aA-zZ\s]+$/, "Only letters are required")
    .min(3, "Name must be at least 6 characters")
    .max(10, "Name must not exceed 10 characters"),
  surname: Yup.string()
    .required("Surname is required")
    .matches(/^[aA-zZ\s]+$/, "Only letters are required")
    .min(3, "Surname must be at least 3 characters")
    .max(10, "Surname must not exceed 10 characters"),
  profession: Yup.string()
    .required("Surname is required")
    .matches(/^[aA-zZ\s]+$/, "Only letters are required")
    .min(3, "Surname must be at least 3 characters")
    .max(10, "Surname must not exceed 10 characters"),
};

const allSubscriberInformation = {
  name: Yup.string()
    .required("Name is required")
    .matches(/^[aA-zZ\s]+$/, "Only letters are required")
    .min(3, "Name must be at least 6 characters")
    .max(10, "Name must not exceed 10 characters"),
  surname: Yup.string()
    .required("Surname is required")
    .matches(/^[aA-zZ\s]+$/, "Only letters are required")
    .min(3, "Surname must be at least 3 characters")
    .max(10, "Surname must not exceed 10 characters"),
  profession: Yup.string()
    .required("Surname is required")
    .matches(/^[aA-zZ\s]+$/, "Only letters are required")
    .min(3, "Surname must be at least 3 characters")
    .max(10, "Surname must not exceed 10 characters"),
  email: Yup.string()
    .required("Email is required")
    .matches(/^([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)$/, "Email is invalid"),
  salary: Yup.number()
    .required("Salary is required")
    .typeError("You must specify a number")
    .min(3, "Must be at least 3 numbers"),
  telephone: Yup.string()
    .matches(
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      "Phone is invalid"
    )
    .required("Phone is required"),
};

const validationSubscriber = (checked) =>
  checked
    ? Yup.object().shape(allSubscriberInformation)
    : Yup.object().shape(basicSubscriberInformation);

export default validationSubscriber;
