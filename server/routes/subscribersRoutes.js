const express = require("express");
const router = express.Router();

const {
  getAllSubscribers,
  getSubscriber,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
} = require("../controllers/subscribersControllers.js");

router.route("/").get(getAllSubscribers).post(createSubscriber);

router
  .route("/:id")
  .get(getSubscriber)
  .put(updateSubscriber)
  .delete(deleteSubscriber);

module.exports = router;
