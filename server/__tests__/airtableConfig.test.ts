import { airtableConfig } from "../helpers/airtableConfig";

describe("airtableConfig", () => {
  it("reads the Airtable base id and token", () => {
    expect(
      airtableConfig({ AIRTABLE_BASE_ID: "appBase", AIRTABLE_TOKEN: "patToken" })
    ).toEqual({
      apiUrl: "https://api.airtable.com/v0",
      baseId: "appBase",
      token: "patToken",
      missing: [],
    });
  });

  it("says which variables are missing", () => {
    expect(airtableConfig({}).missing).toEqual(["AIRTABLE_BASE_ID", "AIRTABLE_TOKEN"]);
    expect(airtableConfig({ AIRTABLE_BASE_ID: "appBase" }).missing).toEqual([
      "AIRTABLE_TOKEN",
    ]);
  });

  it("does not read the old names any more", () => {
    expect(
      airtableConfig({ REACT_APP_DB_ID: "appOld", REACT_APP_API_KEY: "patOld" })
    ).toMatchObject({ baseId: undefined, token: undefined });
  });

  it("uses the fake Airtable address in tests", () => {
    expect(airtableConfig({ AIRTABLE_API_URL: "http://localhost:5099/v0" }).apiUrl).toBe(
      "http://localhost:5099/v0"
    );
  });
});
