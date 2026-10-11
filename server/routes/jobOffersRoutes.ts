import express from "express";

import {
  getAllJobOffers,
  getJobOffer,
  createJobOffer,
  updateJobOffer,
  deleteJobOffer,
} from "../controllers/jobOffersControllers";
import { getJobOfferEmails, previewJobOffer, sendJobOffer } from "../controllers/outboxControllers";

const router = express.Router();

router.route("/").get(getAllJobOffers).post(createJobOffer);

// a draft as one of its recipients would get it
router.route("/preview").post(previewJobOffer);

// the outbox of a job offer
router.route("/:id/send").post(sendJobOffer);
router.route("/:id/outbox").get(getJobOfferEmails);

router
  .route("/:id")
  .get(getJobOffer)
  .patch(updateJobOffer)
  .delete(deleteJobOffer);

export default router;
