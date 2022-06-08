import emailjs from "emailjs-com";

import { toastMessage } from "./helpers";

const {
  REACT_APP_EMAIL_SERVICE_ID,
  REACT_APP_EMAIL_TEMPLATE_ID,
  REACT_APP_EMAIL_USER_ID,
} = process.env;

export function sendEmailTo(data, receivers, callbackPostAirtable) {
  if (typeof callbackPostAirtable !== "function") {
    throw new Error("callbackPostAirtable has to be a function");
  }

  const { title, description } = data;

  //locked email.js because requests are limited

  /*
  receivers.forEach(({ fields: { name, email } }) =>
    emailjs
      .send(
        REACT_APP_EMAIL_SERVICE_ID,
        REACT_APP_EMAIL_TEMPLATE_ID,
        {
          name,
          email,
          title,
          description,
        },
        REACT_APP_EMAIL_USER_ID
      )
      .then((res) => {
        console.log("email sent:", res);

        callbackPostAirtable(data, "sent");
      })
      .catch((err) => {
        console.log("Unfortunately,", err.text);

        callbackPostAirtable(data, "draft");
        toastMessage("Email has not been sent by EmailJS");
      })
  );

  */

  // at the moment I want to show to the user that an email has bent sent
  try {
    callbackPostAirtable(data, "sent");
  } catch (error) {
    callbackPostAirtable(data, "draft");
    toastMessage("Email has not been sent by EmailJS");
  }
}
