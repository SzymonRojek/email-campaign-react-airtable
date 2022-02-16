const express = require("express");
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

module.exports = app;
