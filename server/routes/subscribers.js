const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();

const { REACT_APP_DB_ID, REACT_APP_API_KEY } = process.env;

const subscribers = "subscribers";
const api_url = `https://api.airtable.com/v0/${REACT_APP_DB_ID}/${subscribers}`;

const headers = {
  Authorization: `Bearer ${REACT_APP_API_KEY}`,
  "Content-Type": "application/json",
};

router.get("/", async (request, response) => {
  try {
    const requestConfig = {
      headers: {
        Authorization: `Bearer ${REACT_APP_API_KEY}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.get(api_url, requestConfig);

    if (!data.records.length) {
      response.json({
        error: {
          messageOne: "There is no subscribers added yet",
          messageTwo: "Please add a subscriber",
        },
      });
    } else {
      response.status(200).json(data.records);
    }
  } catch (error) {
    response.json({ error });
  }
});

router.post("/", (request, response) => {
  const { name, surname, email, status, profession, salary, telephone } =
    request.body.fields;

  const configRequest = {
    method: "post",
    url: api_url,
    headers,
    data: {
      fields: { name, surname, email, status, profession, salary, telephone },
    },
  };

  try {
    const { data } = axios(configRequest);

    response.status(200).json(data);
  } catch (error) {
    response.json({ error });
  }
});

router.delete("/:id", async (request, response) => {
  const id = request.params.id;

  const configRequest = {
    method: "delete",
    headers,
    url: `${api_url}/${id}`,
    params: {
      id: id,
    },
  };

  try {
    const { data } = await axios(configRequest);

    request.status(200).json(data);
  } catch (error) {
    response.json({ error });
  }
});

module.exports = router;
