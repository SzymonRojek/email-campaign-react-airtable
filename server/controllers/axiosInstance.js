const axios = require("axios");

require("dotenv").config();

const { REACT_APP_DB_ID, REACT_APP_API_KEY } = process.env;

exports.axiosInstance = axios.create({
  baseURL: `https://api.airtable.com/v0/${REACT_APP_DB_ID}`,
  headers: {
    Authorization: `Bearer ${REACT_APP_API_KEY}`,
    "Content-Type": "application/json",
  },
});
