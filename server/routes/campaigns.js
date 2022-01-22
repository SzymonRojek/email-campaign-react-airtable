const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();

const { REACT_APP_DB_ID, REACT_APP_API_KEY } = process.env;

const campaigns = "campaigns";
const api_url = `https://api.airtable.com/v0/${REACT_APP_DB_ID}/${campaigns}`;

const headers = {
  Authorization: `Bearer ${REACT_APP_API_KEY}`,
  "Content-Type": "application/json",
};

router.get("/", async (request, response) => {
  try {
    const requestConfig = {
      headers,
    };

    const { data } = await axios.get(api_url, requestConfig);

    if (!data.records.length) {
      response.json({
        error: {
          messageOne: "There is no campaigns added yet",
          messageTwo: "Please add a campaign",
        },
      });
    } else {
      response.status(200).json(data.records);
    }
  } catch (error) {
    response.json({ error });
  }
});

router.post("/", async (request, response) => {
  const { title, description, status } = request.body.fields;

  const configRequest = {
    method: "post",
    url: api_url,
    headers,
    data: {
      fields: { title, description, status },
    },
  };

  try {
    const { data } = await axios(configRequest);

    response.status(200).json(data);
  } catch (error) {
    response.json({ error });
  }
});

router.patch("/:id", async (request, response) => {
  const title = request.body.fields.title;
  const description = request.body.fields.description;
  const status = request.body.fields.status;

  const id = request.params.id;

  const configRequest = {
    method: "patch",
    url: `${api_url}/${id}`,
    headers,
    params: {
      id: id,
    },
    data: {
      fields: { title, description, status },
    },
  };

  try {
    const { data } = await axios(configRequest);

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
