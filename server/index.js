const express = require("express");
const path = require("path");
const cors = require("cors");
const subscribersRouter = require("./routes/subscribersRoutes");
const campaignsRouter = require("./routes/campaignsRoutes");
const authRouter = require("./routes/authRoutes");
const { requireAuth } = require("./middleware/requireAuth");

require("dotenv").config();

const app = express();

// Heroku runs behind a proxy - needed for the real client ip in req.ip
app.set("trust proxy", 1);

// middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/subscribers", requireAuth, subscribersRouter);
app.use("/api/campaigns", requireAuth, campaignsRouter);

// unknown api endpoint - answer with json instead of the react index.html
app.use("/api", (req, res) =>
  res.status(404).json({ status: "fail", error: "Endpoint does not exist" })
);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
  });
}

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`sever is running on the port ${PORT}...`);
});
