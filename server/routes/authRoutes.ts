import express from "express";

import { demoLogin, login } from "../controllers/authControllers";

const router = express.Router();

router.route("/login").post(login);
router.route("/demo").post(demoLogin);

export default router;
