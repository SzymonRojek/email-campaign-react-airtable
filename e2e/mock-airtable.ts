/**
 * Fake Airtable REST API for the e2e tests - keeps the records in memory,
 * so the tests never touch the real base and CI needs no secrets.
 *
 *   GET/POST          /v0/:base/:table
 *   GET/PATCH/DELETE  /v0/:base/:table/:id
 *   POST              /__reset   restores the seed data (called before every test)
 *   GET               /__db      current records (assertions in tests)
 */
import express from "express";

import { API_KEY, AIRTABLE_PORT, seed } from "./seed";

type Fields = Record<string, unknown>;
interface AirtableRecord {
  id: string;
  createdTime: string;
  fields: Fields;
}

let db: Record<string, AirtableRecord[]> = {};
let nextId = 1;

const reset = () => {
  db = JSON.parse(JSON.stringify(seed));
  nextId = 1;
};

const notFound = { error: { type: "NOT_FOUND", message: "Could not find record" } };

const app = express();
app.use(express.json());

app.post("/__reset", (req, res) => {
  reset();
  res.json({ ok: true });
});

app.get("/__db", (req, res) => res.json(db));

// the proxy must forward the Airtable key - check it like the real API would
app.use("/v0", (req, res, next) => {
  if (req.headers.authorization !== `Bearer ${API_KEY}`) {
    return res
      .status(401)
      .json({ error: { type: "AUTHENTICATION_REQUIRED", message: "bad key" } });
  }
  next();
});

app.get("/v0/:base/:table", (req, res) => {
  res.json({ records: db[req.params.table] ?? [] });
});

app.post("/v0/:base/:table", (req, res) => {
  const record: AirtableRecord = {
    id: `recE2E${String(nextId++).padStart(11, "0")}`,
    createdTime: new Date().toISOString(),
    fields: { ...req.body.fields, date: new Date().toISOString() },
  };

  (db[req.params.table] ??= []).push(record);
  res.json(record);
});

const findRecord = (table: string, id: string) =>
  (db[table] ?? []).find((record) => record.id === id);

app.get("/v0/:base/:table/:id", (req, res) => {
  const record = findRecord(req.params.table, req.params.id);

  record ? res.json(record) : res.status(404).json(notFound);
});

app.patch("/v0/:base/:table/:id", (req, res) => {
  const record = findRecord(req.params.table, req.params.id);

  if (!record) return res.status(404).json(notFound);

  Object.assign(record.fields, req.body.fields);
  res.json(record);
});

app.delete("/v0/:base/:table/:id", (req, res) => {
  const record = findRecord(req.params.table, req.params.id);

  if (!record) return res.status(404).json(notFound);

  db[req.params.table] = db[req.params.table].filter((item) => item !== record);
  res.json({ id: record.id, deleted: true });
});

reset();
app.listen(AIRTABLE_PORT, () =>
  console.log(`fake Airtable is running on the port ${AIRTABLE_PORT}`)
);
