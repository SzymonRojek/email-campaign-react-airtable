import { Request, Response } from "express";

import { axiosInstance } from "./axiosInstance";
import { sortDataAlphabetically } from "../helpers/sortDataAlphabetically";
import { capitalizeFirstLetter } from "../helpers/capitalizeFirstLetter";
import { getAllRecords } from "../helpers/getAllRecords";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { CampaignFields } from "../types";

const endpoint = "/campaigns";

const notFoundError = {
  status: "fail",
  error: {
    messageOne: "Campaign does not exist",
    messageTwo:
      "Please you have to write a proper url or check an internet connection",
  },
};

export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const records = await getAllRecords(endpoint);

    const sortedData = sortDataAlphabetically(records);
    res.status(200).json(sortedData);
  } catch (error) {
    res.status(404).json({ status: "fail", error: getErrorMessage(error) });
  }
};

export const getCampaign = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.get(`${endpoint}/${id}`);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(notFoundError);
  }
};

export const createCampaign = async (req: Request, res: Response) => {
  const { title, description, status }: CampaignFields = req.body.fields ?? {};

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

export const updateCampaign = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.patch(`${endpoint}/${id}`, req.body);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(notFoundError);
  }
};

export const deleteCampaign = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.delete(`${endpoint}/${id}`);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(notFoundError);
  }
};
