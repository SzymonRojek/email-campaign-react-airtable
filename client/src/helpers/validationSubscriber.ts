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
  // optional - checked only when filled in; the candidate's role, e.g. "Frontend Developer", "C++ Developer"
  profession: Yup.string()
    .trim()
    .matches(/^[\p{L}\d\s\-+/.#&]+$/u, {
      message: "use letters, digits and - + / . # &",
      excludeEmptyString: true,
    })
    .test("min", "must be at least 2 characters", (value) => !value || value.length >= 2)
    .test("max", "must not exceed 30 characters", (value) => !value || value.length <= 30),
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
