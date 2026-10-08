import express from "express";

import {
  getAllCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaignsControllers";
import { getCampaignEmails, sendCampaign } from "../controllers/outboxControllers";

const router = express.Router();

router.route("/").get(getAllCampaigns).post(createCampaign);

// the outbox of a campaign
router.route("/:id/send").post(sendCampaign);
router.route("/:id/emails").get(getCampaignEmails);

router
  .route("/:id")
  .get(getCampaign)
  .patch(updateCampaign)
  .delete(deleteCampaign);

export default router;
