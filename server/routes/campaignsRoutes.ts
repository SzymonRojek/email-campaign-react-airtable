import express from "express";

import {
  getAllCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "../controllers/campaignsControllers";

const router = express.Router();

router.route("/").get(getAllCampaigns).post(createCampaign);

router
  .route("/:id")
  .get(getCampaign)
  .patch(updateCampaign)
  .delete(deleteCampaign);

export default router;
