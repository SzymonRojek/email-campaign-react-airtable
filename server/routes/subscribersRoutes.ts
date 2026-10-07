import express from "express";

import {
  getAllSubscribers,
  getSubscriber,
  createSubscriber,
  updateSubscriber,
  deleteSubscriber,
  importSubscribers,
} from "../controllers/subscribersControllers";

const router = express.Router();

router.route("/").get(getAllSubscribers).post(createSubscriber);

// before "/:id" - many subscribers from a CSV file
router.route("/import").post(importSubscribers);

router
  .route("/:id")
  .get(getSubscriber)
  .patch(updateSubscriber)
  .delete(deleteSubscriber);

export default router;
