import * as Yup from "yup";

const status = ["pending", "blocked", "active"];

const validationSubscriber = Yup.object().shape({
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
  checkbox: Yup.bool().oneOf([true], "field must be checked"),
  status: Yup.string().required("status is required").trim().oneOf(status),
  profession: Yup.string()
    .required("profession is required")
    .trim()
    .matches(/^[aA-zZ\s]+$/, "only letters are required")
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
