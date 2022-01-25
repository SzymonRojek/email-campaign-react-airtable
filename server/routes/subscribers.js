const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();

const { REACT_APP_DB_ID, REACT_APP_API_KEY } = process.env;

const api_url = `https://api.airtable.com/v0/${REACT_APP_DB_ID}/subscribers`;

const headers = {
  headers: {
    Authorization: `Bearer ${REACT_APP_API_KEY}`,
    "Content-Type": "application/json",
  },
};

router.get("/", async (request, response) => {
  try {
    const { data } = await axios.get(api_url, headers);

    if (!data.records.length) {
      response.json({
        info: {
          messageOne: "There are no subscribers added yet",
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

router.get("/:id", async (request, response) => {
  const id = request.params.id;

  try {
    const { data } = await axios(`${api_url}/${id}`, headers);

    response.status(200).json(data);
  } catch (error) {
    console.log(error);
    response.json({
      error: {
        messageOne: "Subscriber does not exist",
        messageTwo: "Please you have to write a proper url",
      },
    });
  }
});

router.post("/", (request, response) => {
  const { name, surname, email, status, profession, salary, telephone } =
    request.body.fields;
  const config = {
    method: "post",
    url: api_url,
    ...headers,
    data: {
      fields: { name, surname, email, status, profession, salary, telephone },
    },
  };

  try {
    const { data } = axios(config);

    response.status(200).json(data);
  } catch (error) {
    response.json({ error });
  }
});

router.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const config = {
    method: "delete",
    ...headers,
    url: `${api_url}/${id}`,
    params: {
      id,
    },
  };

  try {
    const { data } = await axios(config);

    request.status(200).json(data);
  } catch (error) {
    response.json({ error });
  }
});

module.exports = router;
