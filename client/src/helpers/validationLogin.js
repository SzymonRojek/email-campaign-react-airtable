import * as Yup from "yup";

const validationLogin = Yup.object().shape({
  password: Yup.string()
    .required("please enter your password")
    .lowercase()
    .trim()
    .matches(/admin/, "password is not correct"),
  confirmPassword: Yup.string()
    .required("please confirm your password")
    .lowercase()
    .trim()
    .oneOf([Yup.ref("password"), null], "passwords don't match."),
});

export default validationLogin;
