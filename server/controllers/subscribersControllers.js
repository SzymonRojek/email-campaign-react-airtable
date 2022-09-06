const { axiosInstance } = require("./axiosInstance");

const { sortDataAlphabetically } = require("../helpers/sortDataAlphabetically");
const endpoint = "/subscribers";

exports.getAllSubscribers = async (req, res) => {
  try {
    const { data } = await axiosInstance.get(`${endpoint}`);

    const sortedData = sortDataAlphabetically(data.records);
    res.status(200).json(sortedData);
  } catch (error) {
    res.status(404).json({ status: "fail", error });
  }
};

exports.getSubscriber = async (req, res) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.get(`${endpoint}/${id}`);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: {
        message:
          "Subscriber does not exist. Please write a proper url or check an internet connection",
      },
    });
  }
};

exports.createSubscriber = async (req, res) => {
  const { name, surname, email, status, profession, salary, telephone } =
    req.body.fields;

  const createdData = {
    fields: { name, surname, email, status, profession, salary, telephone },
  };

  try {
    const { data } = await axiosInstance.post(`${endpoint}`, createdData);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.updateSubscriber = async (req, res) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.patch(`${endpoint}/${id}`, req.body);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: {
        message:
          "Subscriber does not exist. Please write a proper url or check an internet connection",
      },
    });
  }
};

exports.deleteSubscriber = async (req, res) => {
  const { id } = req.params;

  try {
    const { data } = axiosInstance.delete(`${endpoint}/${id}`);

    res.json(data);
  } catch (error) {
    res.json({
      status: "fail",
      error: {
        message:
          "Subscriber does not exist. Please write a proper url or check an internet connection",
      },
    });
  }
};
