import { expect, test } from "@playwright/test";

import { getAirtable, listRow, loginByApi, resetAirtable, rowAction } from "./helpers";

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

test("adds a subscriber in the panel", async ({ page, request }) => {
  await page.goto("/#/subscribers");
  await page.getByRole("button", { name: "Add subscriber" }).click();
  await expect(page.getByRole("dialog")).toContainText("New subscriber");

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
  // the panel shows the new subscriber at once
  await expect(page).toHaveURL(/#\/subscribers\?view=recE2E\d+$/);
  await expect(page.getByRole("dialog")).toContainText("Łucja Zając");

  await page.keyboard.press("Escape");
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

  await rowAction(page, "Celina Wiśniewska", "Edit");

  await expect(page).toHaveURL(/#\/subscribers\?view=recSubCelina0003&mode=edit$/);
  // the form is filled with the current data
  await expect(page.locator("#surname")).toHaveValue("Wiśniewska");

  await page.locator("#surname").fill("Nowicka");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByText("Subscriber Celina has been edited")).toBeVisible();
  // back to the list with the details panel of the edited subscriber
  await expect(page).toHaveURL(/#\/subscribers\?view=recSubCelina0003$/);
  await expect(page.getByRole("dialog")).toContainText("Celina Nowicka");
  const db = await getAirtable(request);
  expect(
    db.subscribers.find(({ id }) => id === "recSubCelina0003")?.fields.surname
  ).toBe("Nowicka");
});

test("asks before closing the panel with unsaved changes", async ({
  page,
  request,
}) => {
  await page.goto("/#/subscribers");
  await rowAction(page, "Celina Wiśniewska", "Edit");
  await page.locator("#surname").fill("Changed");

  // Esc closes the panel - but there is something unsaved
  await page.keyboard.press("Escape");
  const question = page.getByRole("alertdialog");
  await expect(question).toContainText("Discard changes?");

  await question.getByRole("button", { name: "Keep editing" }).click();
  await expect(question).toHaveCount(0);
  await expect(page.locator("#surname")).toHaveValue("Changed");
  // the keyboard is back in the field the user was in
  await expect(page.locator("#surname")).toBeFocused();

  await page.keyboard.press("Escape");
  await question.getByRole("button", { name: "Discard" }).click();

  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/#\/subscribers$/);
  expect(
    (await getAirtable(request)).subscribers.find(({ id }) => id === "recSubCelina0003")
      ?.fields.surname
  ).toBe("Wiśniewska");
});

test("closes an unchanged form without asking", async ({ page }) => {
  await page.goto("/#/subscribers");
  await rowAction(page, "Celina Wiśniewska", "Edit");

  await page.getByRole("button", { name: "Cancel" }).click();

  // back to the details, no question
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(page).toHaveURL(/#\/subscribers\?view=recSubCelina0003$/);
});

test("removes a subscriber after confirmation", async ({ page, request }) => {
  await page.goto("/#/subscribers");

  await rowAction(page, "Bartek Kowalski", "Delete");
  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toContainText("Delete subscriber?");
  // the full name, so it is clear who goes
  await expect(dialog).toContainText("Bartek Kowalski will be removed permanently");
  await dialog.getByRole("button", { name: "Delete", exact: true }).click();

  await expect(listRow(page, "Bartek")).toHaveCount(0);
  await expect
    .poll(async () => (await getAirtable(request)).subscribers.length)
    .toBe(3);
});

test("keeps the subscriber when the removal is cancelled", async ({ page }) => {
  await page.goto("/#/subscribers");

  await rowAction(page, "Bartek Kowalski", "Delete");
  await page.getByRole("button", { name: "Cancel" }).click();

  await expect(listRow(page, "Bartek")).toHaveCount(1);
});

test("shows the details in a panel over the list", async ({ page }) => {
  await page.goto("/#/subscribers");
  await page.getByLabel("Search subscribers").fill("anna");

  await page.getByRole("link", { name: "Anna Nowak" }).click();

  // the address opens the same panel later
  await expect(page).toHaveURL(/#\/subscribers\?view=recSubAnna000001$/);
  const panel = page.getByRole("dialog");
  await expect(panel).toContainText("anna@example.com");
  await expect(panel).toContainText("+44 (343) 234-2344");

  // "back" closes the panel - the list keeps its search
  await page.goBack();
  await expect(panel).toHaveCount(0);
  await expect(page.getByLabel("Search subscribers")).toHaveValue("anna");
});

test("opens the details by clicking anywhere in the row", async ({ page }) => {
  await page.goto("/#/subscribers");

  await listRow(page, "Celina").getByRole("cell").nth(2).click();

  await expect(page.getByRole("dialog")).toContainText("Celina Wiśniewska");
});

test("shows the details of a pending subscriber and activates them", async ({
  page,
  request,
}) => {
  await page.goto("/#/subscribers");
  await rowAction(page, "Darek Lis", "View details");

  const panel = page.getByRole("dialog");
  await expect(panel).toContainText("Waiting for a confirmation");

  await panel.getByRole("button", { name: "Activate" }).click();

  await expect(page.getByText("Darek Lis is active now")).toBeVisible();
  await expect(panel).not.toContainText("Waiting for a confirmation");
  await expect
    .poll(async () =>
      (await getAirtable(request)).subscribers.find(({ id }) => id === "recSubDarek00004")
        ?.fields.status
    )
    .toBe("active");
});

test("deletes a subscriber from the panel", async ({ page, request }) => {
  await page.goto("/#/subscribers?view=recSubBartek0002");

  await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Delete" }).click();

  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect
    .poll(async () => (await getAirtable(request)).subscribers.length)
    .toBe(3);
});

test("shows cards with a sort button on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/subscribers");

  // no table on a phone - a list of cards, newest first
  await expect(page.getByRole("table")).toHaveCount(0);
  const cards = page.getByRole("list", { name: "Subscribers" }).getByRole("listitem");
  await expect(cards).toHaveCount(4);
  await expect(cards.first()).toContainText("Darek");

  await page.getByRole("button", { name: "Newest first" }).click();

  await expect(page.getByRole("button", { name: "Oldest first" })).toBeVisible();
  await expect(cards.first()).toContainText("Anna");
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
  await expect(page.getByRole("heading", { name: "Subscribers" })).toBeVisible();
});
