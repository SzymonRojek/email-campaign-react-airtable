import { expect, test } from "@playwright/test";

import { getAirtable, listRow, loginByApi, resetAirtable } from "./helpers";

test.beforeEach(async ({ page, request }) => {
  await resetAirtable(request);
  await loginByApi(page, request);
});

test("lists the subscribers, newest first", async ({ page }) => {
  await page.goto("/#/subscribers");

  const rows = page.getByRole("table").first().getByRole("row");

  // header + 4 subscribers, added on 1-4 September
  await expect(rows).toHaveCount(5);
  await expect(rows.nth(1)).toContainText("Darek");
  await expect(rows.nth(4)).toContainText("Anna");
  await expect(listRow(page, "Celina")).toContainText("2022/09/03");

  await page.getByRole("button", { name: /^Date/ }).click();

  await expect(rows.nth(1)).toContainText("Anna");
  await expect(rows.nth(4)).toContainText("Darek");
});

test("adds a subscriber", async ({ page, request }) => {
  await page.goto("/#/subscribers/add");

  await page.locator("#name").fill("Łucja");
  await page.locator("#surname").fill("Zając");
  await page.locator("#email").fill("lucja@example.com");
  await page.locator("#status-id").click();
  await page.getByRole("option", { name: "active" }).click();
  await page.locator("#profession").fill("analyst");
  await page.locator("#salary").fill("4500");
  await page.locator("#telephone").fill("3432342399");
  await page.getByRole("button", { name: "Add subscriber" }).click();

  await expect(page.getByText("Subscriber Łucja has been added")).toBeVisible();
  await expect(page).toHaveURL(/#\/subscribers$/);
  // newest first - the new subscriber is on the first page
  await expect(listRow(page, "Łucja")).toContainText("active");

  const db = await getAirtable(request);
  expect(db.subscribers.map(({ fields }) => fields.name)).toContain("Łucja");
});

test("shows validation errors and does not save", async ({ page, request }) => {
  await page.goto("/#/subscribers/add");

  await page.locator("#name").fill("Jo");
  await page.locator("#email").fill("not-an-email");
  await page.getByRole("button", { name: "Add subscriber" }).click();

  await expect(page.getByText("must be at least 3 characters")).toBeVisible();
  await expect(page.getByText("email is invalid")).toBeVisible();

  const db = await getAirtable(request);
  expect(db.subscribers).toHaveLength(4);
});

test("edits a subscriber", async ({ page, request }) => {
  await page.goto("/#/subscribers");

  await listRow(page, "Celina").getByRole("button", { name: "edit" }).click();

  await expect(page).toHaveURL(/#\/subscribers\/edit\/recSubCelina0003$/);
  // the form is filled with the current data
  await expect(page.locator("#surname")).toHaveValue("Wiśniewska");

  await page.locator("#surname").fill("Nowicka");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByText("Subscriber Celina has been edited")).toBeVisible();
  await expect(page).toHaveURL(/#\/subscribers$/);
  await expect(listRow(page, "Celina")).toContainText("Nowicka");
  const db = await getAirtable(request);
  expect(
    db.subscribers.find(({ id }) => id === "recSubCelina0003")?.fields.surname
  ).toBe("Nowicka");
});

test("removes a subscriber after confirmation", async ({ page, request }) => {
  await page.goto("/#/subscribers");

  await listRow(page, "Bartek").getByRole("button", { name: "delete" }).click();
  await expect(page.getByText("Are you sure you want to remove")).toBeVisible();
  await page.getByRole("button", { name: "YES" }).click();

  await expect(listRow(page, "Bartek")).toHaveCount(0);
  await expect
    .poll(async () => (await getAirtable(request)).subscribers.length)
    .toBe(3);
});

test("keeps the subscriber when the removal is cancelled", async ({ page }) => {
  await page.goto("/#/subscribers");

  await listRow(page, "Bartek").getByRole("button", { name: "delete" }).click();
  await page.getByRole("button", { name: "NO" }).click();

  await expect(listRow(page, "Bartek")).toHaveCount(1);
});

test("shows the details of an active subscriber", async ({ page }) => {
  await page.goto("/#/subscribers");

  await listRow(page, "Anna")
    .getByRole("button", { name: "subscriber-details" })
    .click();

  await expect(page).toHaveURL(/#\/subscribers\/details\/recSubAnna000001$/);
  await expect(page.getByText("anna@example.com")).toBeVisible();
  await expect(page.getByText("+44 (343) 234-2344")).toBeVisible();
});

test("does not show the details of a blocked subscriber", async ({ page }) => {
  await page.goto("/#/subscribers");

  await listRow(page, "Bartek")
    .getByRole("button", { name: "subscriber-details" })
    .click();

  await expect(page.getByText("Unfortunately...")).toBeVisible();
  await expect(page).toHaveURL(/#\/subscribers$/);
});

test("filters the subscribers by status", async ({ page }) => {
  await page.goto("/#/subscribers");

  const rows = page.getByRole("table").first().getByRole("row");

  // all statuses by default
  await expect(rows).toHaveCount(5);

  await page.locator("#status-filter").click();
  await page.getByRole("option", { name: "active" }).click();

  // header + Celina, Anna
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(1)).toContainText("Celina");

  await page.locator("#status-filter").click();
  await page.getByRole("option", { name: "pending" }).click();

  await expect(rows).toHaveCount(2);
  await expect(rows.nth(1)).toContainText("Darek");
});

test("opens the list for the old status address", async ({ page }) => {
  await page.goto("/#/subscribers/status");

  await expect(page).toHaveURL(/#\/subscribers$/);
  await expect(page.getByRole("heading", { name: "all subscribers" })).toBeVisible();
});
