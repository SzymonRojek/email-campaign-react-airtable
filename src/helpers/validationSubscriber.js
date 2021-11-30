import * as Yup from "yup";

const basicSubscriberInformation = {
  name: Yup.string()
    .required("name is required")
    .matches(/^[aA-zZ\s]+$/, "only letters are required")
    .min(3, "must be at least 6 characters")
    .max(10, "must not exceed 10 characters"),
  surname: Yup.string()
    .required("surname is required")
    .matches(/^[aA-zZ\s]+$/, "only letters are required")
    .min(3, "must be at least 3 characters")
    .max(10, "must not exceed 10 characters"),
  profession: Yup.string()
    .required("is required")
    .matches(/^[aA-zZ\s]+$/, "only letters are required")
    .min(3, "must be at least 3 characters")
    .max(10, "must not exceed 10 characters"),
};

const status = ["pending", "blocked", "active"];

const allSubscriberInformation = {
  name: Yup.string()
    .required("name is required")
    .matches(/^[aA-zZ\s]+$/, "only letters are required")
    .min(3, "must be at least 6 characters")
    .max(10, "must not exceed 10 characters"),
  surname: Yup.string()
    .required("surname is required")
    .matches(/^[aA-zZ\s]+$/, "only letters are required")
    .min(3, "must be at least 3 characters")
    .max(10, "must not exceed 10 characters"),
  profession: Yup.string()
    .required("profession is required")
    .matches(/^[aA-zZ\s]+$/, "only letters are required")
    .min(3, "must be at least 3 characters")
    .max(10, "must not exceed 10 characters"),
  status: Yup.string().required("Status is required").oneOf(status),
  email: Yup.string()
    .required("email is required")
    .matches(/^([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)$/, "email is invalid"),
  salary: Yup.number()
    .required("salary is required")
    .typeError("must specify a number")
    .min(3, "must be at least 3 numbers"),
  telephone: Yup.string()
    .matches(
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      "phone is invalid"
    )
    .required("phone is required"),
};

const validationSubscriber = (checked) =>
  checked
    ? Yup.object().shape(allSubscriberInformation)
    : Yup.object().shape(basicSubscriberInformation);

export default validationSubscriber;
