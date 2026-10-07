import express from "express";

import { resetDemo } from "../controllers/demoControllers";

const router = express.Router();

// protected by DEMO_RESET_KEY, not by the login token
router.route("/reset").post(resetDemo);

export default router;
