const { axiosInstance } = require("./axiosInstance");

const { sortDataAlphabetically } = require("../helpers/sortDataAlphabetically");
const { capitalizeFirstLetter } = require("../helpers/capitalizeFirstLetter");
const { getAllRecords } = require("../helpers/getAllRecords");
const { getErrorMessage } = require("../helpers/getErrorMessage");
const endpoint = "/campaigns";

exports.getAllCampaigns = async (req, res) => {
  try {
    const records = await getAllRecords(endpoint);

    const sortedData = sortDataAlphabetically(records);
    res.status(200).json(sortedData);
  } catch (error) {
    res.status(404).json({ status: "fail", error: getErrorMessage(error) });
  }
};

exports.getCampaign = async (req, res) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.get(`${endpoint}/${id}`);

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

  try {
    const { data } = await axiosInstance.post(`${endpoint}`, {
      fields: {
        title: capitalizeFirstLetter(title),
        description: capitalizeFirstLetter(description),
        status,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ status: "fail", error: getErrorMessage(error) });
  }
};

exports.updateCampaign = async (req, res) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.patch(`${endpoint}/${id}`, req.body);

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
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.delete(`${endpoint}/${id}`);

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
