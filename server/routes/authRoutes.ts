import express from "express";

import { login } from "../controllers/authControllers";

const router = express.Router();

router.route("/login").post(login);

export default router;
