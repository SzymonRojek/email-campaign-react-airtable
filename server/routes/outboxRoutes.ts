import express from "express";

import {
  getAllEmails,
  getEmailPreview,
  getUnsubscribe,
  postUnsubscribe,
} from "../controllers/outboxControllers";

// /api/emails - behind the login
export const emailsRouter = express.Router();
emailsRouter.route("/").get(getAllEmails);
emailsRouter.route("/:id/preview").get(getEmailPreview);

// /api/unsubscribe - public: the link in every e-mail (the token proves who it is)
export const unsubscribeRouter = express.Router();
unsubscribeRouter.route("/:token").get(getUnsubscribe).post(postUnsubscribe);
