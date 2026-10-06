// EmailJS sending is commented out below (limited requests) - keep its imports/env for re-enabling
/* eslint-disable @typescript-eslint/no-unused-vars */
import emailjs from "emailjs-com";

import { toastMessage } from "./helpers";
import { CampaignFormValues, Subscriber } from "types";

// sending through EmailJS is turned off - in the public demo anybody could
// add any address and send emails from the owner account
export const DEMO_EMAIL_NOTICE =
  "Demo mode - emails are not really sent, the campaign is only marked as sent.";

const {
  VITE_EMAIL_SERVICE_ID,
  VITE_EMAIL_TEMPLATE_ID,
  VITE_EMAIL_USER_ID,
} = import.meta.env;

export function sendEmailTo(
  data: CampaignFormValues,
  receivers: Subscriber[],
  callbackPostAirtable: () => Promise<void> | void
) {
  if (typeof callbackPostAirtable !== "function") {
    throw new Error("callbackPostAirtable has to be a function");
  }

  // createEmail({ data, status: "draft", callback: handleConfirmModal })
  // const { title, description } = data;

  //locked email.js because requests are limited

  /*
  receivers.forEach(({ fields: { name, email } }) =>
    emailjs
      .send(
        VITE_EMAIL_SERVICE_ID,
        VITE_EMAIL_TEMPLATE_ID,
        {
          name,
          email,
          title,
          description,
        },
        VITE_EMAIL_USER_ID
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
    return callbackPostAirtable();
  } catch (error) {
    toastMessage("Email has not been sent by EmailJS");
  }
}
