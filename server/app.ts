import express from "express";
import * as Sentry from "@sentry/node";
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

// an error no route caught: reported to Sentry (when it is on); the visitor gets a short
// JSON answer instead of Express's HTML page (e.g. 400 for a broken JSON body)
Sentry.setupExpressErrorHandler(app);
app.use(
  (
    error: { status?: number; statusCode?: number },
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
  ) => {
    const status = error.status ?? error.statusCode ?? 500;
    res.status(status).json({
      status: "fail",
      error: status < 500 ? "The request is not valid" : "Something went wrong on the server",
    });
  }
);
