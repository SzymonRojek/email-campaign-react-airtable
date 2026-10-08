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
  // optional - checked only when filled in
  profession: Yup.string()
    .trim()
    .matches(/^[\p{L}\s]+$/u, { message: "only letters are required", excludeEmptyString: true })
    .test("min", "must be at least 3 characters", (value) => !value || value.length >= 3)
    .test("max", "must not exceed 10 characters", (value) => !value || value.length <= 10),
  salary: Yup.string()
    .trim()
    .matches(/^\d+$/, { message: "only numbers are required", excludeEmptyString: true })
    .test("min", "must be at least 3 numbers", (value) => !value || value.length >= 3),
  telephone: Yup.string()
    .trim()
    .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, {
      message: "type only 10 digits",
      excludeEmptyString: true,
    }),
});

export default validationSubscriber;
