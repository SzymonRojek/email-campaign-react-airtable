const express = require("express");
const cors = require("cors");
const axios = require("axios");
const subscribers = require("../routes/subscribers");
const campaigns = require("../routes/campaigns");
const path = require("path");

require("dotenv").config();

const { REACT_APP_DB_ID, REACT_APP_API_KEY } = process.env;

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/subscribers", subscribers);
app.use("/campaigns", campaigns);

const getItemDetails = async (request, response, group) => {
  try {
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${REACT_APP_API_KEY}`,
        "Content-Type": "application/json",
      },
    };
    const id = request.params.id;
    const api_url = `https://api.airtable.com/v0/${REACT_APP_DB_ID}/${group}/${id}`;
    const { data } = await axios(api_url, requestConfig);

    return await response.status(200).json(data);
  } catch (error) {
    return response.json({ error });
  }
};

app.get("/subscribers/:id", (request, response) =>
  getItemDetails(request, response, "subscribers")
);

app.get("/campaigns/:id", (request, response) =>
  getItemDetails(request, response, "campaigns")
);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV) {
  app.use(express.static(path.resolve(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/, index.html"));
  });
}

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`sever is running on the port ${PORT}`);
});
