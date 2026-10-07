import { Request, Response } from "express";

import { safeEqual } from "../helpers/authToken";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { resetDemoData } from "../demo/resetDemoData";

// one reset at a time - a second one would create the examples twice
let running = false;

// only for tests
export const setResetRunning = (value: boolean) => {
  running = value;
};

// called once a day by the "Demo data reset" GitHub Action
export const resetDemo = async (req: Request, res: Response) => {
  const key = process.env.DEMO_RESET_KEY;

  // no key on this server (local, staging) = the endpoint does not exist
  if (!key) {
    return res
      .status(404)
      .json({ status: "fail", error: "Endpoint does not exist" });
  }

  const [type, token] = (req.headers.authorization || "").split(" ");

  if (type !== "Bearer" || !safeEqual(token, key)) {
    return res.status(401).json({ status: "fail", error: "Unauthorized" });
  }

  if (running) {
    return res
      .status(409)
      .json({ status: "fail", error: "A reset is already running" });
  }

  running = true;

  try {
    const result = await resetDemoData({ force: req.body?.force === true });

    res.status(200).json({ status: "ok", result });
  } catch (error) {
    res.status(500).json({ status: "fail", error: getErrorMessage(error) });
  } finally {
    running = false;
  }
};
