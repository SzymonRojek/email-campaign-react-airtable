import express from "express";

import {
  getAllSubscribers,
  getSubscriber,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
  importSubscribers,
} from "../controllers/subscribersControllers";
import { getSubscriberEmails } from "../controllers/outboxControllers";

const router = express.Router();

router.route("/").get(getAllSubscribers).post(createSubscriber);

// before "/:id" - many subscribers from a CSV file
router.route("/import").post(importSubscribers);

// the campaigns the subscriber got
router.route("/:id/emails").get(getSubscriberEmails);

router
  .route("/:id")
  .get(getSubscriber)
  .patch(updateSubscriber)
  .delete(deleteSubscriber);

export default router;
