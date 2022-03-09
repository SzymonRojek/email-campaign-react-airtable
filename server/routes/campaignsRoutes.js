const express = require("express");
const router = express.Router();
const {
  getAllCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} = require("./../controllers/campaignsControllers");

router.route("/").get(getAllCampaigns).post(createCampaign);

router
  .route("/:id")
  .get(getCampaign)
  .put(updateCampaign)
  .delete(deleteCampaign);

module.exports = router;
