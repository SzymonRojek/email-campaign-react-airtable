import emailjs from "emailjs-com";

const {
  REACT_APP_EMAIL_SERVICE_ID,
  REACT_APP_EMAIL_TEMPLATE_ID,
  REACT_APP_EMAIL_USER_ID,
} = process.env;

export const sendEmail = (paramsScheme, setEmailError) => {
  emailjs
    .send(
      REACT_APP_EMAIL_SERVICE_ID,
      REACT_APP_EMAIL_TEMPLATE_ID,
      paramsScheme,
      REACT_APP_EMAIL_USER_ID
    )
    .then((res) => {
      console.log("patch:", res);
      setEmailError(false);
    })
    .catch((err) => {
      console.log("Unfortunately,", err);
      setEmailError(err);
    });
};
