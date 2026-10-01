import express from "express";

import {
  getAllSubscribers,
  getSubscriber,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
} from "../controllers/subscribersControllers";

const router = express.Router();

router.route("/").get(getAllSubscribers).post(createSubscriber);

router
  .route("/:id")
  .get(getSubscriber)
  .patch(updateSubscriber)
  .delete(deleteSubscriber);

export default router;
