import fs from "node:fs";
import { expect, test } from "@playwright/test";

import { getAirtable, listRow, loginByApi, resetAirtable, rowAction } from "./helpers";

test.beforeEach(async ({ page, request }) => {
  await resetAirtable(request);
  await loginByApi(page, request);
});

// the seed: "Welcome" was sent to Anna and Celina
const openWelcome = async (page: import("@playwright/test").Page) => {
  await page.goto("/#/campaigns");
  await listRow(page, "Welcome").getByRole("cell").nth(2).click();
  await expect(page).toHaveURL(/#\/campaigns\/recCampSent00002$/);
};

test("shows who got a sent campaign", async ({ page }) => {
  await openWelcome(page);

  await expect(page.getByRole("heading", { name: /Welcome/ })).toBeVisible();
  await expect(page.getByText("to 2 subscribers", { exact: false })).toBeVisible();
  const recipients = page.getByRole("list", { name: "Recipients" }).getByRole("listitem");
  await expect(recipients).toHaveCount(2);
  await expect(recipients.nth(0)).toContainText("anna@example.com");
  await expect(recipients.nth(1)).toContainText("celina@example.com");
});

test("opens an e-mail as its recipient got it", async ({ page }) => {
  await openWelcome(page);

  await page.getByRole("button", { name: "View the e-mail to Anna Nowak" }).click();

  // the preview has an address of its own
  await expect(page).toHaveURL(/\?email=recEmailAnna0001$/);
  const panel = page.getByRole("dialog");
  await expect(panel).toContainText("to Anna Nowak <anna@example.com>");
  await expect(panel).toContainText("Email Campaign Dashboard <campaigns@example.com>");
  const email = page.frameLocator('iframe[title="E-mail to anna@example.com"]');
  await expect(email.getByText("Hello Anna,")).toBeVisible();
  await expect(email.getByText("Hello new subscribers")).toBeVisible();
  await expect(email.getByRole("link", { name: "Unsubscribe" })).toHaveAttribute(
    "href",
    /#\/unsubscribe\/recSubAnna000001\.[\w-]+$/
  );

  // "back" closes the preview
  await page.goBack();
  await expect(panel).toHaveCount(0);
});

test("personalizes a draft and previews it for each recipient before sending", async ({
  page,
}) => {
  await page.goto("/#/campaigns/edit/recCampDraft0001");

  await page.getByLabel("Title").fill("{{name}}, autumn sale");
  await page.getByLabel("Description").fill("Dear {{name}}, 30% off for you.");

  await page.getByRole("button", { name: "Preview" }).click();

  const panel = page.getByRole("dialog");
  await expect(panel.getByRole("heading", { name: "Anna, autumn sale" })).toBeVisible();
  const toAnna = page.frameLocator('iframe[title="E-mail to anna@example.com"]');
  await expect(toAnna.getByText("Dear Anna, 30% off for you.")).toBeVisible();

  // another recipient gets their own name
  await page.getByLabel("Preview for").click();
  await page.getByRole("option", { name: "Celina Wiśniewska" }).click();
  await expect(panel.getByRole("heading", { name: "Celina, autumn sale" })).toBeVisible();
  await expect(
    page.frameLocator('iframe[title="E-mail to celina@example.com"]').getByText("Dear Celina,", { exact: false })
  ).toBeVisible();

  // nothing was saved or sent by the preview
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/#\/campaigns\/edit\/recCampDraft0001$/);
});

test("points out a mistyped placeholder", async ({ page }) => {
  await page.goto("/#/campaigns/edit/recCampDraft0001");

  await page.getByLabel("Description").fill("Dear {{nmae}}");
  await page.getByRole("button", { name: "Preview" }).click();

  await expect(
    page.getByText("unknown placeholder {{nmae}} - use {{name}} or {{surname}}")
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("exports who got a sent campaign as CSV", async ({ page }) => {
  await openWelcome(page);

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const file = await download;

  expect(file.suggestedFilename()).toMatch(/^welcome-recipients-\d{4}-\d{2}-\d{2}\.csv$/);
  const lines = fs.readFileSync(await file.path(), "utf8").trim().split(/\r?\n/);
  expect(lines).toEqual([
    "name,email,sentAt",
    "Anna Nowak,anna@example.com,2022-09-06T10:00:00.000Z",
    "Celina Wiśniewska,celina@example.com,2022-09-06T10:00:00.000Z",
  ]);
});

test("a subscriber's panel lists the campaigns they got", async ({ page }) => {
  await page.goto("/#/subscribers?view=recSubAnna000001");

  const received = page.getByRole("list", { name: "Campaigns received" });
  await expect(received.getByRole("link")).toHaveCount(1);
  await received.getByRole("link", { name: /Welcome/ }).click();

  // the e-mail she got opens at once
  await expect(page).toHaveURL(/#\/campaigns\/recCampSent00002\?email=recEmailAnna0001$/);
  await expect(
    page.frameLocator('iframe[title="E-mail to anna@example.com"]').getByText("Hello Anna,")
  ).toBeVisible();
});

test("a subscriber who got nothing yet", async ({ page }) => {
  await page.goto("/#/subscribers?view=recSubDarek00004");

  await expect(page.getByRole("dialog").getByText("No campaigns yet.")).toBeVisible();
});

test("a sent campaign's menu leads to its recipients", async ({ page }) => {
  await page.goto("/#/campaigns");

  await rowAction(page, "Welcome", "View recipients");

  await expect(page).toHaveURL(/#\/campaigns\/recCampSent00002$/);
});

test("unsubscribes with the link from an e-mail - without logging in", async ({
  page,
  browser,
  request,
}) => {
  await openWelcome(page);
  await page.getByRole("button", { name: "View the e-mail to Anna Nowak" }).click();
  const link = await page
    .frameLocator('iframe[title="E-mail to anna@example.com"]')
    .getByRole("link", { name: "Unsubscribe" })
    .getAttribute("href");

  // a visitor who is not logged in
  const visitor = await (await browser.newContext()).newPage();
  await visitor.goto(link!);

  await expect(visitor.getByRole("heading", { name: "Unsubscribe?" })).toBeVisible();
  await expect(visitor.getByText("anna@example.com")).toBeVisible();
  await visitor.getByRole("button", { name: "Unsubscribe" }).click();
  await expect(visitor.getByRole("heading", { name: "You are unsubscribed" })).toBeVisible();

  const anna = (await getAirtable(request)).subscribers.find(
    ({ id }) => id === "recSubAnna000001"
  );
  expect(anna?.fields.status).toBe("unsubscribed");

  // the same link again: already done
  await visitor.reload();
  await expect(visitor.getByRole("heading", { name: "You are unsubscribed" })).toBeVisible();

  // she is not a recipient any more
  await page.goto("/#/campaigns/add");
  await expect(page.getByText("active subscribers - 1")).toBeVisible();
  await page.goto("/#/subscribers");
  await expect(listRow(page, "Anna")).toContainText("unsubscribed");
});

test("refuses a link that is not valid", async ({ browser }) => {
  const visitor = await (await browser.newContext()).newPage();

  await visitor.goto("/#/unsubscribe/recSubAnna000001.forged-signature");

  await expect(visitor.getByRole("heading", { name: "This link is not valid" })).toBeVisible();
  await expect(visitor.getByRole("button", { name: "Unsubscribe" })).toHaveCount(0);
});
