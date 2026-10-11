import express from "express";

import {
  getAllEmails,
  getEmailPreview,
  getOptOut,
  postOptOut,
} from "../controllers/outboxControllers";

// /api/outbox - behind the login
export const outboxRouter = express.Router();
outboxRouter.route("/").get(getAllEmails);
outboxRouter.route("/:id/preview").get(getEmailPreview);

// /api/opt-out - public: the link in every e-mail (the token proves who it is)
export const optOutRouter = express.Router();
optOutRouter.route("/:token").get(getOptOut).post(postOptOut);
