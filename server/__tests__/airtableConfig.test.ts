import { airtableConfig } from "../helpers/airtableConfig";

describe("airtableConfig", () => {
  it("reads the Airtable base id and token", () => {
    expect(
      airtableConfig({ AIRTABLE_BASE_ID: "appBase", AIRTABLE_TOKEN: "patToken" })
    ).toEqual({
      apiUrl: "https://api.airtable.com/v0",
      baseId: "appBase",
      token: "patToken",
      oldNames: [],
    });
  });

  it("still accepts the old names and says which ones to rename", () => {
    const config = airtableConfig({ REACT_APP_DB_ID: "appOld", REACT_APP_API_KEY: "patOld" });

    expect(config).toMatchObject({ baseId: "appOld", token: "patOld" });
    expect(config.oldNames).toEqual([
      "REACT_APP_DB_ID -> AIRTABLE_BASE_ID",
      "REACT_APP_API_KEY -> AIRTABLE_TOKEN",
    ]);
  });

  it("prefers the new names when both are set", () => {
    expect(
      airtableConfig({
        AIRTABLE_BASE_ID: "appNew",
        REACT_APP_DB_ID: "appOld",
        AIRTABLE_TOKEN: "patNew",
        REACT_APP_API_KEY: "patOld",
      })
    ).toMatchObject({ baseId: "appNew", token: "patNew", oldNames: [] });
  });

  it("uses the fake Airtable address in tests", () => {
    expect(airtableConfig({ AIRTABLE_API_URL: "http://localhost:5099/v0" }).apiUrl).toBe(
      "http://localhost:5099/v0"
    );
  });
});
