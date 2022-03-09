import emailjs from "emailjs-com";

const {
  REACT_APP_EMAIL_SERVICE_ID,
  REACT_APP_EMAIL_TEMPLATE_ID,
  REACT_APP_EMAIL_USER_ID,
} = process.env;

const sendEmail = (paramsScheme, setEmailError) => {
  emailjs
    .send(
      REACT_APP_EMAIL_SERVICE_ID,
      REACT_APP_EMAIL_TEMPLATE_ID,
      paramsScheme,
      REACT_APP_EMAIL_USER_ID
    )
    .then((res) => {
      console.log("email sent:", res);
      setEmailError(false);
    })
    .catch((err) => {
      console.log("Unfortunately,", err);
      setEmailError(err);
    });
};

export const sendEmailJSonSuccess = (
  data,
  finalSelectedActiveSubscribers,
  allActiveSubscribers,
  setEmailError
) => {
  const { title, description } = data;

  if (finalSelectedActiveSubscribers.length) {
    finalSelectedActiveSubscribers.map(({ fields: { name, email } }) =>
      sendEmail(
        {
          name,
          email,
          title,
          description,
        },
        setEmailError
      )
    );
  } else {
    allActiveSubscribers.forEach(({ fields: { name, email } }) => {
      sendEmail(
        {
          name,
          email,
          title,
          description,
        },
        setEmailError
      );
    });
  }
};
