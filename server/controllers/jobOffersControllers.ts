import { Request, Response } from "express";

import { axiosInstance } from "./axiosInstance";
import { sortDataAlphabetically } from "../helpers/sortDataAlphabetically";
import { capitalizeFirstLetter } from "../helpers/capitalizeFirstLetter";
import { getAllRecords } from "../helpers/getAllRecords";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { JobOfferFields } from "../types";
import { deleteJobOfferEmails } from "./outboxControllers";

const endpoint = "/jobOffers";

const notFoundError = {
  status: "fail",
  error: {
    messageOne: "Job offer does not exist",
    messageTwo:
      "Please you have to write a proper url or check an internet connection",
  },
};

export const getAllJobOffers = async (req: Request, res: Response) => {
  try {
    const records = await getAllRecords(endpoint);

    const sortedData = sortDataAlphabetically(records);
    res.status(200).json(sortedData);
  } catch (error) {
    res.status(404).json({ status: "fail", error: getErrorMessage(error) });
  }
};

export const getJobOffer = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.get(`${endpoint}/${id}`);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(notFoundError);
  }
};

export const createJobOffer = async (req: Request, res: Response) => {
  const { subject, message, status }: JobOfferFields = req.body.fields ?? {};

  try {
    const { data } = await axiosInstance.post(`${endpoint}`, {
      fields: {
        subject: capitalizeFirstLetter(subject),
        message: capitalizeFirstLetter(message),
        status,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ status: "fail", error: getErrorMessage(error) });
  }
};

export const updateJobOffer = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.patch(`${endpoint}/${id}`, req.body);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(notFoundError);
  }
};

export const deleteJobOffer = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.delete(`${endpoint}/${id}`);

    // its e-mails go too - an outbox without the job offer makes no sense
    await deleteJobOfferEmails(id);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(notFoundError);
  }
};
