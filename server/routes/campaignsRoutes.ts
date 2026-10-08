import express from "express";

import {
  getAllCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaignsControllers";
import { getCampaignEmails, previewCampaign, sendCampaign } from "../controllers/outboxControllers";

const router = express.Router();

router.route("/").get(getAllCampaigns).post(createCampaign);

// a draft as one of its recipients would get it
router.route("/preview").post(previewCampaign);

// the outbox of a campaign
router.route("/:id/send").post(sendCampaign);
router.route("/:id/emails").get(getCampaignEmails);

router
  .route("/:id")
  .get(getCampaign)
  .patch(updateCampaign)
  .delete(deleteCampaign);

export default router;
