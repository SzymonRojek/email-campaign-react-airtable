import { Request, Response } from "express";

import { axiosInstance } from "./axiosInstance";
import { sortDataAlphabetically } from "../helpers/sortDataAlphabetically";
import { getAllRecords } from "../helpers/getAllRecords";
import { getErrorMessage } from "../helpers/getErrorMessage";
import { chunks, wait } from "../helpers/batches";
import { CandidateFields } from "../types";

const endpoint = "/candidates";

// "Anna@Example.com " and "anna@example.com" are the same address
const normalizeEmail = (email: unknown) => String(email ?? "").trim().toLowerCase();

const duplicateError = {
  status: "fail",
  error: "A candidate with this e-mail already exists",
};

// e-mails of all candidates, optionally without one record (the edited one)
const takenEmails = async (exceptId?: string) => {
  const records = await getAllRecords(endpoint);

  return new Set(
    records
      .filter((record) => record.id !== exceptId)
      .map((record) => normalizeEmail(record.fields.email))
  );
};

const notFoundError = {
  status: "fail",
  error: {
    message:
      "Candidate does not exist. Please write a proper url or check an internet connection",
  },
};

export const getAllCandidates = async (req: Request, res: Response) => {
  try {
    const records = await getAllRecords(endpoint);

    const sortedData = sortDataAlphabetically(records);
    res.status(200).json(sortedData);
  } catch (error) {
    res.status(404).json({ status: "fail", error: getErrorMessage(error) });
  }
};

export const getCandidate = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.get(`${endpoint}/${id}`);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(notFoundError);
  }
};

export const createCandidate = async (req: Request, res: Response) => {
  const {
    name,
    surname,
    email,
    status,
    role,
    expectedSalary,
    phone,
  }: CandidateFields = req.body.fields ?? {};

  const createdData = {
    fields: { name, surname, email, status, role, expectedSalary, phone },
  };

  try {
    if (email && (await takenEmails()).has(normalizeEmail(email))) {
      return res.status(409).json(duplicateError);
    }

    const { data } = await axiosInstance.post(`${endpoint}`, createdData);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: getErrorMessage(error),
    });
  }
};

export const updateCandidate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const email = req.body?.fields?.email;

  try {
    if (email && (await takenEmails(id)).has(normalizeEmail(email))) {
      return res.status(409).json(duplicateError);
    }
  } catch (error) {
    return res.status(400).json({ status: "fail", error: getErrorMessage(error) });
  }

  try {
    const { data } = await axiosInstance.patch(`${endpoint}/${id}`, req.body);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(notFoundError);
  }
};

export const deleteCandidate = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data } = await axiosInstance.delete(`${endpoint}/${id}`);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(notFoundError);
  }
};

export const MAX_IMPORT_ROWS = 100;

// what an import can make of the new candidates - "do not contact" / "opted out" never
// come from a file (a CSV column can not say who agreed to get e-mails)
const importStatuses = ["awaiting consent", "open to offers"];
// the same rule as the client form
const emailPattern = /^([^.@]+)(\.[^.@]+)*@([^.@]+\.)+([^.@]+)$/;

const text = (value: unknown) => (value === undefined || value === null ? "" : String(value).trim());

// the client checks every row before sending - this only keeps bad data out of Airtable
const invalidReason = (fields: CandidateFields) => {
  if (!text(fields.name) || !text(fields.surname)) return "name and surname are required";
  if (!emailPattern.test(text(fields.email))) return "the e-mail is invalid";
  return null;
};

// POST /api/candidates/import  { candidates: [...], status: "awaiting consent" | "open to offers" }
// many candidates from a CSV file - one status for all of them, the rows' own status is ignored
export const importCandidates = async (req: Request, res: Response) => {
  const rows: CandidateFields[] = req.body?.candidates;
  const status = req.body?.status ?? "awaiting consent";

  if (!importStatuses.includes(status)) {
    return res
      .status(400)
      .json({ status: "fail", error: "Imported candidates can only be pending or active" });
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ status: "fail", error: "There is nothing to import" });
  }

  if (rows.length > MAX_IMPORT_ROWS) {
    return res.status(400).json({
      status: "fail",
      error: `At most ${MAX_IMPORT_ROWS} candidates can be imported at once`,
    });
  }

  try {
    const taken = await takenEmails();
    const toCreate: CandidateFields[] = [];
    const skipped: { row: number; email: string; reason: string }[] = [];

    rows.forEach((fields, index) => {
      const email = normalizeEmail(fields.email);
      const reason =
        invalidReason(fields) ??
        (taken.has(email) ? "the e-mail already exists" : null);

      if (reason) {
        skipped.push({ row: index + 1, email: text(fields.email), reason });
        return;
      }

      // the second row with the same e-mail in the file is skipped too
      taken.add(email);
      toCreate.push({
        name: text(fields.name),
        surname: text(fields.surname),
        email: text(fields.email),
        status,
        role: text(fields.role),
        expectedSalary: text(fields.expectedSalary),
        phone: text(fields.phone),
      });
    });

    for (const [i, batch] of chunks(toCreate).entries()) {
      if (i > 0) await wait(250);
      await axiosInstance.post(endpoint, {
        records: batch.map((fields) => ({ fields })),
      });
    }

    res.status(200).json({ status: "ok", created: toCreate.length, skipped });
  } catch (error) {
    res.status(400).json({ status: "fail", error: getErrorMessage(error) });
  }
};
