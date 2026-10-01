import * as Yup from "yup";

// the password itself is checked by the server (POST /auth/login)
const validationLogin = Yup.object().shape({
  password: Yup.string().required("please enter your password"),
  confirmPassword: Yup.string()
    .required("please confirm your password")
    .oneOf([Yup.ref("password"), null], "passwords don't match."),
});

export default validationLogin;
