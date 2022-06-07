const { axiosInstance } = require("./axiosInstance");

const endpoint = "/campaigns";

exports.getAllCampaigns = async (req, res) => {
  try {
    const { data } = await axiosInstance.get(`${endpoint}`);

    res.status(200).json(data.records);
  } catch (error) {
    res.status(404).json({ status: "fail", error });
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
      fields: { title, description, status },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ status: "fail", error });
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
    const { data } = axiosInstance.delete(`${endpoint}/${id}`);

    res.json(data);
  } catch (error) {
    res.json({
      status: "fail",
      error: {
        messageOne: "Campaign does not exist",
        messageTwo:
          "Please you have to write a proper url or check an internet connection",
      },
    });
  }
};
