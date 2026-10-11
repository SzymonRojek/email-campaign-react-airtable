import express from "express";

import {
  getAllCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  importCandidates,
} from "../controllers/candidatesControllers";
import { getCandidateEmails } from "../controllers/outboxControllers";

const router = express.Router();

router.route("/").get(getAllCandidates).post(createCandidate);

// before "/:id" - many candidates from a CSV file
router.route("/import").post(importCandidates);

// the job offers the candidate got
router.route("/:id/outbox").get(getCandidateEmails);

router
  .route("/:id")
  .get(getCandidate)
  .patch(updateCandidate)
  .delete(deleteCandidate);

export default router;
