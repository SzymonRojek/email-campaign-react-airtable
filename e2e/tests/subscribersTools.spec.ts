import fs from "node:fs";
import { expect, test } from "@playwright/test";

import { getAirtable, getToken, listRow, loginByApi, resetAirtable } from "./helpers";

test.beforeEach(async ({ page, request }) => {
  await resetAirtable(request);
  await loginByApi(page, request);
});

const rows = (page: import("@playwright/test").Page) =>
  page.getByRole("table").first().getByRole("row");

test("searches the subscribers by name or e-mail", async ({ page }) => {
  await page.goto("/#/subscribers");
  const search = page.getByLabel("Search subscribers");

  // no Polish letters needed - "wisniewska" finds "Wiśniewska"
  await search.fill("wisniewska");
  await expect(rows(page)).toHaveCount(2);
  await expect(rows(page).nth(1)).toContainText("Celina");

  await search.fill("bartek@");
  await expect(rows(page).nth(1)).toContainText("Bartek");

  await search.fill("nobody");
  await expect(page.getByText('No subscribers match "nobody".')).toBeVisible();

  await page.getByRole("button", { name: "Clear the search" }).click();
  await expect(rows(page)).toHaveCount(5);
});

test("does not add a subscriber with an e-mail that is already used", async ({
  page,
  request,
}) => {
  await page.goto("/#/subscribers/add");

  await page.locator("#name").fill("Annabel");
  await page.locator("#surname").fill("Kowal");
  // another letter case - still the same address
  await page.locator("#email").fill("ANNA@example.com");
  await page.locator("#status-id").click();
  await page.getByRole("option", { name: "active" }).click();
  await page.locator("#profession").fill("tester");
  await page.locator("#salary").fill("4500");
  await page.locator("#telephone").fill("3432342399");
  await page.getByRole("button", { name: "Add subscriber" }).click();

  await expect(page.getByText("this e-mail is already used by Anna Nowak")).toBeVisible();
  expect((await getAirtable(request)).subscribers).toHaveLength(4);
});

test("the server refuses a duplicate e-mail too", async ({ request }) => {
  const res = await request.post("/api/subscribers", {
    headers: { Authorization: `Bearer ${await getToken(request)}` },
    data: { fields: { name: "Anna", surname: "Copy", email: "anna@example.com", status: "active" } },
  });

  expect(res.status()).toBe(409);
});

test("exports the subscribers shown in the list", async ({ page }) => {
  await page.goto("/#/subscribers");
  await page.locator("#status-filter").click();
  await page.getByRole("option", { name: "active" }).click();

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const file = await download;

  expect(file.suggestedFilename()).toMatch(/^subscribers-\d{4}-\d{2}-\d{2}\.csv$/);
  const lines = fs.readFileSync(await file.path(), "utf8").trim().split(/\r?\n/);

  // header + the 2 active subscribers, newest first
  expect(lines).toHaveLength(3);
  expect(lines[0]).toContain("name,surname,email,status");
  expect(lines[1]).toContain("Celina,Wiśniewska,celina@example.com,active");
  expect(lines[2]).toContain("Anna,Nowak,anna@example.com,active");
});

test("imports the valid rows of a CSV file", async ({ page, request }) => {
  await page.goto("/#/subscribers");
  await page.getByRole("button", { name: "Import CSV" }).click();

  const dialog = page.getByRole("dialog");
  const csv = [
    "name;surname;email;status;profession;salary;telephone",
    "Ola;Kowalczyk;ola@example.com;;designer;6100;3432342390",
    "Anna;Again;anna@example.com;active;tester;5000;3432342391",
    "Jo;Short;bad-email;active;tester;5000;3432342392",
  ].join("\n");
  await dialog.getByLabel("CSV file").setInputFiles({
    name: "subscribers.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(csv),
  });

  await expect(dialog.getByText("1 ready")).toBeVisible();
  // the file has a status column - the status is chosen in the dialog instead
  await expect(dialog.getByText("The file has a status column - it is not used")).toBeVisible();
  await expect(dialog.getByText("2 with errors")).toBeVisible();
  await expect(dialog.getByText("email: already on the list")).toBeVisible();

  await dialog.getByRole("button", { name: "Import 1 subscriber" }).click();

  await expect(page.getByText("1 subscriber imported")).toBeVisible();
  await expect(dialog).toHaveCount(0);
  // no status in the file - pending
  await expect(listRow(page, "Ola Kowalczyk")).toContainText("pending");

  const db = await getAirtable(request);
  expect(db.subscribers.map(({ fields }) => fields.email)).toEqual([
    "anna@example.com",
    "bartek@example.com",
    "celina@example.com",
    "darek@example.com",
    "ola@example.com",
  ]);
});

test("imports as active only with the permission to e-mail them", async ({ page, request }) => {
  await page.goto("/#/subscribers");
  await page.getByRole("button", { name: "Import CSV" }).click();

  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("CSV file").setInputFiles({
    name: "subscribers.csv",
    mimeType: "text/csv",
    // only the required columns
    buffer: Buffer.from("name,surname,email\nOliver,Wilson,oliver@example.com"),
  });

  await dialog.getByLabel(/Active/).check();
  const importButton = dialog.getByRole("button", { name: "Import 1 subscriber" });
  await expect(importButton).toBeDisabled();

  await dialog.getByLabel("I have permission to e-mail these people").check();
  await importButton.click();

  await expect(listRow(page, "Oliver Wilson")).toContainText("active");
  const oliver = (await getAirtable(request)).subscribers.find(
    ({ fields }) => fields.email === "oliver@example.com"
  );
  expect(oliver?.fields.status).toBe("active");
});
