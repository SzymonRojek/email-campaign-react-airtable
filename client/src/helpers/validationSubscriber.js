import * as Yup from "yup";

const basicSubscriberInformation = {
  name: Yup.string()
    .required("name is required")
    .trim()
    .matches(/^[aA-zZ\s]+$/, "only letters are required")
    .min(3, "must be at least 6 characters")
    .max(10, "must not exceed 10 characters"),
  surname: Yup.string()
    .required("surname is required")
    .trim()
    .matches(/^[aA-zZ\s]+$/, "only letters are required")
    .min(3, "must be at least 3 characters")
    .max(10, "must not exceed 10 characters"),
  email: Yup.string()
    .required("email is required")
    .trim()
    .matches(/^([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)$/, "email is invalid"),
};

const status = ["pending", "blocked", "active"];

const allSubscriberInformation = {
  name: Yup.string()
    .required("name is required")
    .trim()
    .matches(/^[aA-zZ\s]+$/, "only letters are required")
    .min(3, "must be at least 6 characters")
    .max(10, "must not exceed 10 characters"),
  surname: Yup.string()
    .required("surname is required")
    .trim()
    .matches(/^[aA-zZ\s]+$/, "only letters are required")
    .min(3, "must be at least 3 characters")
    .max(10, "must not exceed 10 characters"),
  profession: Yup.string()
    .required("profession is required")
    .trim()
    .matches(/^[aA-zZ\s]+$/, "only letters are required")
    .min(3, "must be at least 3 characters")
    .max(10, "must not exceed 10 characters"),
  status: Yup.string().required("status is required").trim().oneOf(status),
  email: Yup.string()
    .required("email is required")
    .trim()
    .matches(/^([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)$/, "email is invalid"),
  salary: Yup.number()
    .required("salary is required")
    .typeError("must specify a number")
    .min(3, "must be at least 3 numbers"),
  telephone: Yup.string()
    .required("telephone is required")
    .trim()
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
