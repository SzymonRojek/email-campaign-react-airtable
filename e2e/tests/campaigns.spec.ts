import { expect, test } from "@playwright/test";

import { getAirtable, listRow, loginByApi, resetAirtable, rowAction } from "./helpers";

test.beforeEach(async ({ page, request }) => {
  await resetAirtable(request);
  await loginByApi(page, request);
});

const fillCampaign = async (
  page: import("@playwright/test").Page,
  title: string
) => {
  await page.locator("#title").fill(title);
  await page.locator("#description").fill("Big discounts this week");
};

const campaignByTitle = async (
  request: import("@playwright/test").APIRequestContext,
  title: string
) =>
  (await getAirtable(request)).campaigns.find(
    ({ fields }) => fields.title === title
  );

test("lists the campaigns with their status", async ({ page }) => {
  await page.goto("/#/campaigns");

  await expect(listRow(page, "Autumn sale")).toContainText("draft");
  await expect(listRow(page, "Welcome")).toContainText("sent");
  // the "..." button says what it is for
  const actions = page.getByRole("button", { name: "Actions for Welcome" });
  await actions.hover();
  await expect(page.getByRole("tooltip")).toContainText("More actions");

  // a sent campaign: no "Edit" at all - it can be duplicated
  await actions.click();
  await expect(page.getByRole("menuitem", { name: "Duplicate" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Edit" })).toHaveCount(0);
});

test("saves a draft", async ({ page, request }) => {
  await page.goto("/#/campaigns/add");

  await fillCampaign(page, "black friday");
  await page.getByRole("button", { name: "draft" }).click();

  await expect(
    page.getByText('Campaign "Black friday" has been saved as a draft')
  ).toBeVisible();
  await expect(page).toHaveURL(/#\/campaigns$/);
  // the server capitalizes the first letter only
  await expect(listRow(page, "Black friday")).toContainText("draft");
  expect((await campaignByTitle(request, "Black friday"))?.fields.status).toBe(
    "draft"
  );
});

test("sends a campaign to all active subscribers", async ({ page, request }) => {
  await page.goto("/#/campaigns/add");

  await expect(page.getByText("active subscribers - 2")).toBeVisible();
  await expect(
    page.getByText("Demo mode - emails are not really sent", { exact: false })
  ).toBeVisible();
  await fillCampaign(page, "Newsletter");
  await page.getByRole("button", { name: "send" }).click();

  // sending can not be undone - the app asks first
  const confirm = page.getByRole("alertdialog");
  await expect(confirm).toContainText('Send "Newsletter"?');
  await expect(confirm).toContainText("all 2 active subscribers");
  await confirm.getByRole("button", { name: "Send", exact: true }).click();

  // back on the list - no toast, the campaign shows as sent
  await expect(page).toHaveURL(/#\/campaigns$/);
  await expect(listRow(page, "Newsletter")).toContainText("sent");
  await expect(page.locator(".Toastify__toast")).toHaveCount(0);
  expect((await campaignByTitle(request, "Newsletter"))?.fields.status).toBe(
    "sent"
  );
});

test("sends a campaign to the chosen subscribers", async ({ page }) => {
  await page.goto("/#/campaigns/add");

  await page.getByRole("button", { name: "Choose recipients" }).click();
  const popup = page.getByRole("dialog");
  await expect(popup.getByText("2 of 2 selected")).toBeVisible();

  await popup.getByLabel(/Celina/).uncheck();
  await expect(popup.getByText("1 of 2 selected")).toBeVisible();
  await popup.getByRole("button", { name: "Done" }).click();

  await expect(page.getByText("selected subscribers: 1 from 2")).toBeVisible();
});

test("does not send when every subscriber is unchecked", async ({
  page,
  request,
}) => {
  await page.goto("/#/campaigns/add");

  await page.getByRole("button", { name: "Choose recipients" }).click();
  const popup = page.getByRole("dialog");
  // everybody is selected - "Select all" unchecks everybody
  await popup.getByLabel("Select all").click();
  await expect(popup.getByText("Choose at least one subscriber")).toBeVisible();
  await popup.getByRole("button", { name: "Done" }).click();

  await fillCampaign(page, "Nobody");
  await page.getByRole("button", { name: "send" }).click();

  await expect(
    page.getByText("Please choose at least one subscriber")
  ).toBeVisible();
  expect(await campaignByTitle(request, "Nobody")).toBeUndefined();
});

test("edits and sends a draft", async ({ page, request }) => {
  await page.goto("/#/campaigns");

  // a click anywhere in a draft's row opens the editor
  await listRow(page, "Autumn sale").getByRole("cell").nth(2).click();

  await expect(page).toHaveURL(/#\/campaigns\/edit\/recCampDraft0001$/);
  await expect(page.locator("#title")).toHaveValue("Autumn sale");

  await page.locator("#title").fill("Autumn sale 2");
  await page.getByRole("button", { name: "send" }).click();
  await page.getByRole("alertdialog").getByRole("button", { name: "Send", exact: true }).click();

  await expect(page.locator(".Toastify__toast")).toHaveCount(0);
  await expect(page).toHaveURL(/#\/campaigns$/);
  const db = await getAirtable(request);
  expect(db.campaigns.find(({ id }) => id === "recCampDraft0001")?.fields).toMatchObject({
    title: "Autumn sale 2",
    status: "sent",
  });
});

test("removes a campaign", async ({ page, request }) => {
  await page.goto("/#/campaigns");

  await rowAction(page, "Welcome", "Delete");
  await expect(page.getByRole("alertdialog")).toContainText("Delete campaign?");
  await page.getByRole("button", { name: "Delete", exact: true }).click();

  await expect(listRow(page, "Welcome")).toHaveCount(0);
  await expect
    .poll(async () => (await getAirtable(request)).campaigns.length)
    .toBe(1);
});

test("lists the campaigns newest first and filters them by status", async ({
  page,
}) => {
  await page.goto("/#/campaigns");

  const rows = page.getByRole("table").first().getByRole("row");

  // Welcome (6 September) before Autumn sale (5 September)
  await expect(rows.nth(1)).toContainText("Welcome");
  await expect(rows.nth(2)).toContainText("Autumn sale");

  await page.locator("#status-filter").click();
  await page.getByRole("option", { name: "draft" }).click();

  await expect(rows).toHaveCount(2);
  await expect(rows.nth(1)).toContainText("Autumn sale");
});

test("does not send when the confirmation is cancelled", async ({ page, request }) => {
  await page.goto("/#/campaigns/add");
  await fillCampaign(page, "Maybe later");
  await page.getByRole("button", { name: "send" }).click();

  await page.getByRole("alertdialog").getByRole("button", { name: "Cancel" }).click();

  await expect(page).toHaveURL(/#\/campaigns\/add$/);
  expect(await campaignByTitle(request, "Maybe later")).toBeUndefined();
});

test("asks before leaving a campaign with unsaved changes", async ({ page }) => {
  // opened from the list - "back" stays in the app
  await page.goto("/#/campaigns");
  await page.getByRole("main").getByRole("link", { name: "New campaign" }).click();
  await page.locator("#title").fill("Half written");

  await page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Dashboard" })
    .click();

  const question = page.getByRole("alertdialog");
  await expect(question).toContainText("Discard changes?");
  await question.getByRole("button", { name: "Keep editing" }).click();
  await expect(question).toHaveCount(0);
  await expect(page).toHaveURL(/#\/campaigns\/add$/);
  await expect(page.locator("#title")).toHaveValue("Half written");
  await expect(page.locator("#title")).toBeFocused();

  // "back" in the browser asks too
  await page.goBack();
  await question.getByRole("button", { name: "Discard" }).click();
  await expect(page).toHaveURL(/#\/campaigns$/);
});

test("duplicates a sent campaign as a new draft", async ({ page, request }) => {
  await page.goto("/#/campaigns");

  // a sent campaign's row does not open anything
  await listRow(page, "Welcome").getByRole("cell").nth(2).click();
  await expect(page).toHaveURL(/#\/campaigns$/);

  await rowAction(page, "Welcome", "Duplicate");

  // the copy opens in the editor to be changed
  await expect(page).toHaveURL(/#\/campaigns\/edit\/recE2E\d+$/);
  await expect(page.locator("#title")).toHaveValue("Welcome (copy)");
  expect((await campaignByTitle(request, "Welcome (copy)"))?.fields).toMatchObject({
    description: "Hello new subscribers",
    status: "draft",
  });
});
