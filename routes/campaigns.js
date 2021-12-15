const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();

const { REACT_APP_DB_ID, REACT_APP_API_KEY } = process.env;

const API_URL_Campaigns = `https://api.airtable.com/v0/${REACT_APP_DB_ID}/campaigns`;
router.get("/", async (req, res) => {
  try {
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${REACT_APP_API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.get(API_URL_Campaigns, requestConfig);

    res.status(200).json(data.records);
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
