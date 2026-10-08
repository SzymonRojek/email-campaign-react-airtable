import * as Yup from "yup";

import { SubscriberStatus } from "types";

const status: SubscriberStatus[] = ["pending", "blocked", "active", "unsubscribed"];

const validationSubscriber = Yup.object({
  name: Yup.string()
    .required("name is required")
    .trim()
    .matches(/^[\p{L}\s]+$/u, "only letters are required")
    .min(3, "must be at least 3 characters")
    .max(10, "must not exceed 10 characters"),
  surname: Yup.string()
    .required("surname is required")
    .trim()
    .matches(/^[\p{L}\s]+$/u, "only letters are required")
    .min(3, "must be at least 3 characters")
    .max(10, "must not exceed 10 characters"),
  email: Yup.string()
    .required("email is required")
    .trim()
    .matches(/^([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)$/, "email is invalid"),
  status: Yup.mixed<SubscriberStatus>()
    .required("status is required")
    .oneOf(status, "status is required"),
  profession: Yup.string()
    .required("profession is required")
    .trim()
    .matches(/^[\p{L}\s]+$/u, "only letters are required")
    .min(3, "must be at least 3 characters")
    .max(10, "must not exceed 10 characters"),
  salary: Yup.string()
    .trim()
    .required("salary is required")
    .matches(/^\d+$/, "only numbers are required")
    .min(3, "must be at least 3 numbers"),
  telephone: Yup.string()
    .trim()
    .required("telephone is required")
    .matches(
      /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      "type only 10 digits"
    ),
});

export default validationSubscriber;
