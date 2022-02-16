const axios = require("axios");

require("dotenv").config();

const { REACT_APP_DB_ID, REACT_APP_API_KEY } = process.env;

const api_url = `https://api.airtable.com/v0/${REACT_APP_DB_ID}/campaigns`;

const headers = {
  headers: {
    Authorization: `Bearer ${REACT_APP_API_KEY}`,
    "Content-Type": "application/json",
  },
};

exports.getAllCampaigns = async (req, res) => {
  try {
    const { data } = await axios.get(api_url, headers);

    res.status(200).json(data.records);
  } catch (error) {
    res.status(404).json({ status: "fail", error });
  }
};

exports.getCampaign = async (req, res) => {
  const id = req.params.id;

  try {
    const { data } = await axios(`${api_url}/${id}`, headers);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: {
        messageOne: "Campaign does not exist",
        messageTwo:
          "Please you have to write a proper url or check an internet connection",
      },
    });
  }
};

exports.createCampaign = async (req, res) => {
  const { title, description, status } = req.body.fields;

  const config = {
    method: "post",
    url: api_url,
    ...headers,
    data: {
      fields: { title, description, status },
    },
  };

  try {
    const { data } = await axios(config);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

exports.updateCampaign = async (req, res) => {
  const { title, description, status } = req.body.fields;
  const id = req.params.id;
  const config = {
    method: "patch",
    url: `${api_url}/${id}`,
    ...headers,
    params: {
      id,
    },
    data: {
      fields: { title, description, status },
    },
  };

  try {
    const { data } = await axios(config);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: {
        messageOne: "Campaign does not exist",
        messageTwo:
          "Please you have to write a proper url or check an internet connection",
      },
    });
  }
};

exports.deleteCampaign = async (req, res) => {
  const id = req.params.id;
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

    req.status(204).json(data);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: {
        messageOne: "Campaign does not exist",
        messageTwo:
          "Please you have to write a proper url or check an internet connection",
      },
    });
  }
};
