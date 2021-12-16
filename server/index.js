const express = require("express");
const cors = require("cors");
const axios = require("axios");
const subscribers = require("./routes/subscribers");
const campaigns = require("./routes/campaigns");
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

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
  });
}

app.get("/subscribers/:id", (request, response) =>
  getDetails(request, response, "subscribers")
);

app.get("/campaigns/:id", (request, response) =>
  getDetails(request, response, "campaigns")
);

const getDetails = async (request, response, group) => {
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

    response.status(200).json(data);
  } catch (error) {
    response.json({ error });
  }
};

app.delete("/subscribers/:id", async (request, response) => {
  const id = request.params.id;
  const api_url = `https://api.airtable.com/v0/${REACT_APP_DB_ID}/subscribers/${id}`;
  const requestConfig = {
    headers: {
      Authorization: `Bearer ${REACT_APP_API_KEY}`,
      "Content-Type": "application/json",
    },
    params: {
      id: id,
    },
  };

  try {
    await axios.delete(api_url, requestConfig); // maybe variable
  } catch (error) {
    response.json({ error });
  }
});

app.delete("/campaigns/:id", async (request, response) => {
  const id = request.params.id;
  const api_url = `https://api.airtable.com/v0/${REACT_APP_DB_ID}/campaigns/${id}`;
  const requestConfig = {
    headers: {
      Authorization: `Bearer ${REACT_APP_API_KEY}`,
      "Content-Type": "application/json",
    },
    params: {
      id: id,
    },
  };

  try {
    await axios.delete(api_url, requestConfig);
  } catch (error) {
    response.json({ error });
  }
});

app.post("/subscribers", async (request, response) => {
  const name = request.body.fields.name;
  const surname = request.body.fields.surname;
  const email = request.body.fields.email;
  const status = request.body.fields.status;
  const profession = request.body.fields.profession;
  const salary = request.body.fields.salary;
  const telephone = request.body.fields.telephone;

  const api_url = `https://api.airtable.com/v0/${REACT_APP_DB_ID}/subscribers`;

  const configRequest = {
    method: "post",
    url: api_url,
    headers: {
      Authorization: `Bearer ${REACT_APP_API_KEY}`,
      "Content-Type": "application/json",
    },
    data: {
      fields: { name, surname, email, status, profession, salary, telephone },
    },
  };

  try {
    const { data } = await axios(configRequest);

    response.status(200).send(data);
  } catch (error) {
    response.send({ error });
  }
});

app.post("/campaigns", async (request, response) => {
  const title = request.body.fields.title;
  const description = request.body.fields.description;
  const status = request.body.fields.status;

  const api_url = `https://api.airtable.com/v0/${REACT_APP_DB_ID}/campaigns`;

  const configRequest = {
    method: "post",
    url: api_url,
    headers: {
      Authorization: `Bearer ${REACT_APP_API_KEY}`,
      "Content-Type": "application/json",
    },
    data: {
      fields: { title, description, status },
    },
  };

  try {
    const { data } = await axios(configRequest);

    response.status(200).send(data);
  } catch (error) {
    response.send({ error });
  }
});

app.patch("/campaigns/:id", async (request, response) => {
  const title = request.body.fields.title;
  const description = request.body.fields.description;
  const status = request.body.fields.status;

  const id = request.params.id;
  const api_url = `https://api.airtable.com/v0/${REACT_APP_DB_ID}/campaigns/${id}`;

  const configRequest = {
    method: "patch",
    url: api_url,
    headers: {
      Authorization: `Bearer ${REACT_APP_API_KEY}`,
      "Content-Type": "application/json",
    },
    params: {
      id: id,
    },
    data: {
      fields: { title, description, status },
    },
  };

  try {
    const { data } = await axios(configRequest);

    response.status(200).send(data);
  } catch (error) {
    response.send({ error });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`sever is running on the port ${PORT}`);
});
