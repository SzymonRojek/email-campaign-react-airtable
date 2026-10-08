import express from "express";

import { createFeedback, getFeedback } from "../controllers/feedbackControllers";

// /api/feedback - public: the login page shows it and anybody may leave some
const router = express.Router();

router.route("/").get(getFeedback).post(createFeedback);

export default router;
