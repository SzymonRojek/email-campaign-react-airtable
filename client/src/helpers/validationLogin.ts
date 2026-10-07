import * as Yup from "yup";

// the password itself is checked by the server (POST /auth/login)
const validationLogin = Yup.object({
  password: Yup.string().required("please enter your password"),
});

export default validationLogin;
