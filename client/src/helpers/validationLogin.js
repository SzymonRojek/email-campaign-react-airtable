import * as Yup from "yup";

const validationLogin = Yup.object().shape({
  password: Yup.string()
    .required("Please enter your password")
    .lowercase()
    .matches(/admin/, "Password is not correct"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .trim()
    .lowercase()
    .oneOf([Yup.ref("password"), null], "Passwords don't match."),
});

export default validationLogin;
