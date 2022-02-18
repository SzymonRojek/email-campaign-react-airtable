const express = require("express");
const path = require("path");
const cors = require("cors");
const subscribersRouter = require("./routes/subscribersRoutes");
const campaignsRouter = require("./routes/campaignsRoutes");

require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/subscribers", subscribersRouter);
app.use("/campaigns", campaignsRouter);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV) {
  app.use(express.static(path.resolve(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/, index.html"));
  });
}

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`sever is running on the port ${PORT}...`);
});
