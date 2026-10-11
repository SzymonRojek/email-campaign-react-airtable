import { expect, test } from "@playwright/test";

import { getAirtable, listRow, loginByApi, resetAirtable, rowAction } from "./helpers";

test.beforeEach(async ({ page, request }) => {
  await resetAirtable(request);
  await loginByApi(page, request);
});

const fillJobOffer = async (
  page: import("@playwright/test").Page,
  title: string
) => {
  await page.locator("#subject").fill(title);
  await page.locator("#message").fill("Big discounts this week");
};

const jobOfferByTitle = async (
  request: import("@playwright/test").APIRequestContext,
  title: string
) =>
  (await getAirtable(request)).jobOffers.find(
    ({ fields }) => fields.subject === title
  );

test("lists the job offers with their status", async ({ page }) => {
  await page.goto("/#/job-offers");

  await expect(listRow(page, "Autumn sale")).toContainText("Draft");
  await expect(listRow(page, "Welcome")).toContainText("Sent");
  // the "..." button says what it is for
  const actions = page.getByRole("button", { name: "Actions for Welcome" });
  await actions.hover();
  await expect(page.getByRole("tooltip")).toContainText("More actions");

  // a sent job offer: no "Edit" at all - it can be duplicated
  await actions.click();
  await expect(page.getByRole("menuitem", { name: "Duplicate" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Edit" })).toHaveCount(0);
});

test("saves a draft", async ({ page, request }) => {
  await page.goto("/#/job-offers/add");

  await fillJobOffer(page, "black friday");
  await page.getByRole("button", { name: "draft" }).click();

  await expect(
    page.getByText('Job offer "Black friday" has been saved as a draft')
  ).toBeVisible();
  await expect(page).toHaveURL(/#\/job-offers$/);
  // the server capitalizes the first letter only
  await expect(listRow(page, "Black friday")).toContainText("Draft");
  expect((await jobOfferByTitle(request, "Black friday"))?.fields.status).toBe(
    "draft"
  );
});

test("sends a job offer to every candidate open to offers", async ({ page, request }) => {
  await page.goto("/#/job-offers/add");

  await expect(page.getByText("Goes to 2 candidates")).toBeVisible();
  await expect(
    page.getByText("Demo mode - nobody really gets these e-mails", { exact: false })
  ).toBeVisible();
  await fillJobOffer(page, "Newsletter");
  await page.getByRole("button", { name: "send" }).click();

  // sending can not be undone - the app asks first
  const confirm = page.getByRole("alertdialog");
  await expect(confirm).toContainText('Send "Newsletter"?');
  await expect(confirm).toContainText("It goes to 2 candidates.");
  await confirm.getByRole("button", { name: "Send", exact: true }).click();

  // the job offer's page shows who got it - no toast
  await expect(page).toHaveURL(/#\/job-offers\/recE2E\d+$/);
  const recipients = page.getByRole("list", { name: "Recipients" }).getByRole("listitem");
  await expect(recipients).toHaveCount(2);
  await expect(recipients.first()).toContainText("Anna Nowak");
  await expect(page.locator(".Toastify__toast")).toHaveCount(0);

  // the outbox has one e-mail for each active candidate
  const newsletter = await jobOfferByTitle(request, "Newsletter");
  expect(newsletter?.fields.status).toBe("sent");
  const outbox = (await getAirtable(request)).outbox.filter(
    ({ fields }) => fields.jobOfferId === newsletter?.id
  );
  expect(outbox.map(({ fields }) => fields.email).sort()).toEqual([
    "anna@example.com",
    "celina@example.com",
  ]);
});

test("sends a job offer to the candidates chosen by hand", async ({ page }) => {
  await page.goto("/#/job-offers/add");

  await page.getByRole("button", { name: "Choose recipients" }).click();
  const popup = page.getByRole("dialog");
  await expect(popup.getByText("2 of 2 selected")).toBeVisible();

  await popup.getByLabel(/Celina/).uncheck();
  await expect(popup.getByText("1 of 2 selected")).toBeVisible();
  await popup.getByRole("button", { name: "Done" }).click();

  await expect(page.getByText("Goes to 1 of 2 matching candidates - chosen by hand")).toBeVisible();
});

test("does not send when every candidate is unchecked", async ({
  page,
  request,
}) => {
  await page.goto("/#/job-offers/add");

  await page.getByRole("button", { name: "Choose recipients" }).click();
  const popup = page.getByRole("dialog");
  // everybody is selected - "Select all" unchecks everybody
  await popup.getByLabel("Select all").click();
  await expect(popup.getByText("Choose at least one candidate")).toBeVisible();
  await popup.getByRole("button", { name: "Done" }).click();

  await fillJobOffer(page, "Nobody");
  await page.getByRole("button", { name: "send" }).click();

  await expect(
    page.getByText("Please choose at least one candidate")
  ).toBeVisible();
  expect(await jobOfferByTitle(request, "Nobody")).toBeUndefined();
});

test("edits and sends a draft", async ({ page, request }) => {
  await page.goto("/#/job-offers");

  // a click anywhere in a draft's row opens the editor
  await listRow(page, "Autumn sale").getByRole("cell").nth(2).click();

  await expect(page).toHaveURL(/#\/job-offers\/edit\/recCampDraft0001$/);
  await expect(page.locator("#subject")).toHaveValue("Autumn sale");

  await page.locator("#subject").fill("Autumn sale 2");
  await page.getByRole("button", { name: "send" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Send", exact: true }).click();

  await expect(page.locator(".Toastify__toast")).toHaveCount(0);
  await expect(page).toHaveURL(/#\/job-offers\/recCampDraft0001$/);
  const db = await getAirtable(request);
  expect(db.jobOffers.find(({ id }) => id === "recCampDraft0001")?.fields).toMatchObject({
    subject: "Autumn sale 2",
    status: "sent",
  });
});

test("removes a job offer", async ({ page, request }) => {
  await page.goto("/#/job-offers");

  await rowAction(page, "Welcome", "Delete");
  await expect(page.getByRole("alertdialog")).toContainText("Delete job offer?");
  await page.getByRole("button", { name: "Delete", exact: true }).click();

  await expect(listRow(page, "Welcome")).toHaveCount(0);
  await expect
    .poll(async () => (await getAirtable(request)).jobOffers.length)
    .toBe(1);
  // its outbox goes too
  await expect.poll(async () => (await getAirtable(request)).outbox.length).toBe(0);
});

test("lists the job offers newest first and filters them by status", async ({
  page,
}) => {
  await page.goto("/#/job-offers");

  const rows = page.getByRole("table").first().getByRole("row");

  // Welcome (6 September) before Autumn sale (5 September)
  await expect(rows.nth(1)).toContainText("Welcome");
  await expect(rows.nth(2)).toContainText("Autumn sale");

  await page.locator("#status-filter").click();
  await page.getByRole("option", { name: "Draft" }).click();

  await expect(rows).toHaveCount(2);
  await expect(rows.nth(1)).toContainText("Autumn sale");
});

test("does not send when the confirmation is cancelled", async ({ page, request }) => {
  await page.goto("/#/job-offers/add");
  await fillJobOffer(page, "Maybe later");
  await page.getByRole("button", { name: "send" }).click();

  await page.getByRole("alertdialog").getByRole("button", { name: "Cancel" }).click();

  await expect(page).toHaveURL(/#\/job-offers\/add$/);
  expect(await jobOfferByTitle(request, "Maybe later")).toBeUndefined();
});

test("asks before leaving a job offer with unsaved changes", async ({ page }) => {
  // opened from the list - "back" stays in the app
  await page.goto("/#/job-offers");
  await page.getByRole("main").getByRole("link", { name: "New job offer" }).click();
  await page.locator("#subject").fill("Half written");

  await page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Dashboard" })
    .click();

  const question = page.getByRole("alertdialog");
  await expect(question).toContainText("Discard changes?");
  await question.getByRole("button", { name: "Keep editing" }).click();
  await expect(question).toHaveCount(0);
  await expect(page).toHaveURL(/#\/job-offers\/add$/);
  await expect(page.locator("#subject")).toHaveValue("Half written");
  await expect(page.locator("#subject")).toBeFocused();

  // "back" in the browser asks too
  await page.goBack();
  await question.getByRole("button", { name: "Discard" }).click();
  await expect(page).toHaveURL(/#\/job-offers$/);
});

test("duplicates a sent job offer as a new draft", async ({ page, request }) => {
  await page.goto("/#/job-offers");

  await rowAction(page, "Welcome", "Duplicate");

  // the copy opens in the editor to be changed
  await expect(page).toHaveURL(/#\/job-offers\/edit\/recE2E\d+$/);
  await expect(page.locator("#subject")).toHaveValue("Welcome (copy)");
  expect((await jobOfferByTitle(request, "Welcome (copy)"))?.fields).toMatchObject({
    message: "Hello new candidates",
    status: "draft",
  });
});
