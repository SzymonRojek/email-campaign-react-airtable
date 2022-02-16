const express = require("express");
const router = express.Router();
const {
  getAllCampaigns,
  createCampaign,
  getCampaign,
  updateCampaign,
  deleteCampaign,
} = require("./../controllers/campaignsControllers");

router.route("/").get(getAllCampaigns).post(createCampaign);

router
  .route("/:id")
  .get(getCampaign)
  .patch(updateCampaign)
  .delete(deleteCampaign);

module.exports = router;
