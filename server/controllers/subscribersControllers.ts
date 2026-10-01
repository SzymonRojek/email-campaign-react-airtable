import { Request, Response } from "express";

import { axiosInstance } from "./axiosInstance";
import { sortDataAlphabetically } from "../helpers/sortDataAlphabetically";
import { getAllRecords } from "../helpers/getAllRecords";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { SubscriberFields } from "../types";

const endpoint = "/subscribers";

const notFoundError = {
  status: "fail",
  error: {
    message:
      "Subscriber does not exist. Please write a proper url or check an internet connection",
  },
};

export const getAllSubscribers = async (req: Request, res: Response) => {
  try {
    const records = await getAllRecords(endpoint);

    const sortedData = sortDataAlphabetically(records);
    res.status(200).json(sortedData);
  } catch (error) {
    res.status(404).json({ status: "fail", error: getErrorMessage(error) });
  }
};

export const getSubscriber = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.get(`${endpoint}/${id}`);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(notFoundError);
  }
};

export const createSubscriber = async (req: Request, res: Response) => {
  const {
    name,
    surname,
    email,
    status,
    profession,
    salary,
    telephone,
  }: SubscriberFields = req.body.fields ?? {};

  const createdData = {
    fields: { name, surname, email, status, profession, salary, telephone },
  };

  try {
    const { data } = await axiosInstance.post(`${endpoint}`, createdData);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: getErrorMessage(error),
    });
  }
};

export const updateSubscriber = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.patch(`${endpoint}/${id}`, req.body);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(notFoundError);
  }
};

export const deleteSubscriber = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.delete(`${endpoint}/${id}`);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(notFoundError);
  }
};
