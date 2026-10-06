import { expect, test } from "@playwright/test";

import { getAirtable, listRow, loginByApi, resetAirtable } from "./helpers";

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
  // only drafts can be edited
  await expect(
    listRow(page, "Welcome").getByRole("button", { name: "edit off" })
  ).toBeVisible();
});

test("saves a draft", async ({ page, request }) => {
  await page.goto("/#/campaigns/add");

  await fillCampaign(page, "black friday");
  await page.getByRole("button", { name: "draft" }).click();

  await expect(page.getByText("drafted and added to the list")).toBeVisible();
  await page.getByRole("button", { name: "YES" }).click();

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

  await expect(page.getByText("sent and added to the list")).toBeVisible();
  // the confirmation says no email was really sent
  await expect(
    page.getByRole("alertdialog").getByText("Demo mode", { exact: false })
  ).toBeVisible();
  expect((await campaignByTitle(request, "Newsletter"))?.fields.status).toBe(
    "sent"
  );
});

test("sends a campaign to the chosen subscribers", async ({ page }) => {
  await page.goto("/#/campaigns/add");

  await page.getByRole("checkbox", { name: "choose active subscribers" }).check();
  const popup = page.getByRole("dialog");
  await expect(popup.getByText("Checked subscribers: 2")).toBeVisible();

  await popup.getByLabel(/Celina/).uncheck();
  await expect(popup.getByText("Checked subscribers: 1")).toBeVisible();
  await popup.getByRole("button", { name: "ok" }).click();

  await expect(page.getByText("selected subscribers: 1 from 2")).toBeVisible();
});

test("does not send when every subscriber is unchecked", async ({
  page,
  request,
}) => {
  await page.goto("/#/campaigns/add");

  await page.getByRole("checkbox", { name: "choose active subscribers" }).check();
  const popup = page.getByRole("dialog");
  await popup.getByRole("button", { name: "unchecked" }).click();
  await expect(popup.getByText("Please choose subscribers")).toBeVisible();
  await popup.getByRole("button", { name: "ok" }).click();

  await fillCampaign(page, "Nobody");
  await page.getByRole("button", { name: "send" }).click();

  await expect(
    page.getByText("Please choose at least one subscriber")
  ).toBeVisible();
  expect(await campaignByTitle(request, "Nobody")).toBeUndefined();
});

test("edits and sends a draft", async ({ page, request }) => {
  await page.goto("/#/campaigns");

  await listRow(page, "Autumn sale").getByRole("button", { name: "edit" }).click();

  await expect(page).toHaveURL(/#\/campaigns\/edit\/recCampDraft0001$/);
  await expect(page.locator("#title")).toHaveValue("Autumn sale");

  await page.locator("#title").fill("Autumn sale 2");
  await page.getByRole("button", { name: "send" }).click();

  await expect(page.getByText("has been sent")).toBeVisible();
  await expect(
    page.getByRole("dialog").getByText("Demo mode", { exact: false })
  ).toBeVisible();
  await page.getByRole("button", { name: "close" }).click();

  await expect(page).toHaveURL(/#\/campaigns$/);
  const db = await getAirtable(request);
  expect(db.campaigns.find(({ id }) => id === "recCampDraft0001")?.fields).toMatchObject({
    title: "Autumn sale 2",
    status: "sent",
  });
});

test("removes a campaign", async ({ page, request }) => {
  await page.goto("/#/campaigns");

  await listRow(page, "Welcome").getByRole("button", { name: "delete" }).click();
  await page.getByRole("button", { name: "YES" }).click();

  await expect(listRow(page, "Welcome")).toHaveCount(0);
  await expect
    .poll(async () => (await getAirtable(request)).campaigns.length)
    .toBe(1);
});
