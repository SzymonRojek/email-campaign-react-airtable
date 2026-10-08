import express from "express";
import path from "path";
import dotenv from "dotenv";

import subscribersRouter from "./routes/subscribersRoutes";
import campaignsRouter from "./routes/campaignsRoutes";
import authRouter from "./routes/authRoutes";
import demoRouter from "./routes/demoRoutes";
import feedbackRouter from "./routes/feedbackRoutes";
import { emailsRouter, unsubscribeRouter } from "./routes/outboxRoutes";
import { requireAuth } from "./middleware/requireAuth";

dotenv.config();

export const app = express();

// Render runs behind a proxy - needed for the real client ip in req.ip
app.set("trust proxy", 1);
// do not tell everybody which server this is
app.disable("x-powered-by");

// middleware - no CORS: the app and the API share one address (in development
// the Vite proxy forwards /api), so other websites can not call the API from a browser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// health check for the hosting (Render) - no auth, no Airtable call
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/demo", demoRouter);
app.use("/api/unsubscribe", unsubscribeRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/subscribers", requireAuth, subscribersRouter);
app.use("/api/campaigns", requireAuth, campaignsRouter);
app.use("/api/emails", requireAuth, emailsRouter);

// unknown api endpoint - answer with json instead of the react index.html
app.use("/api", (req, res) =>
  res.status(404).json({ status: "fail", error: "Endpoint does not exist" })
);

if (process.env.NODE_ENV === "production") {
  // the compiled server lives in server/dist - the client build is two levels up
  const clientBuild = path.resolve(__dirname, "../../client/build");

  app.use(express.static(clientBuild));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });
}
