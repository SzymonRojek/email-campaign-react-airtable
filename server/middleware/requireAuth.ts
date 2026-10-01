import { NextFunction, Request, Response } from "express";

import { isAuthConfigured, verifyToken } from "../helpers/authToken";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [type, token] = (req.headers.authorization || "").split(" ");

  if (!isAuthConfigured() || type !== "Bearer" || !verifyToken(token)) {
    return res
      .status(401)
      .json({ status: "fail", error: "Unauthorized - please log in" });
  }

  next();
};
