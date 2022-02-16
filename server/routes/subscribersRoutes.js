const express = require("express");
const router = express.Router();
const {
  getAllSubscribers,
  createSubscriber,
  getSubscriber,
  updateSubscriber,
  deleteSubscriber,
} = require("./../controllers/subscribersController.js");

router.route("/").get(getAllSubscribers).post(createSubscriber);

router
  .route("/:id")
  .get(getSubscriber)
  .patch(updateSubscriber)
  .delete(deleteSubscriber);

module.exports = router;
