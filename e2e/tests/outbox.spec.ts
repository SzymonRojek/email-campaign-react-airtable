import fs from "node:fs";
import { expect, test } from "@playwright/test";

import { getAirtable, listRow, loginByApi, resetAirtable, rowAction } from "./helpers";

test.beforeEach(async ({ page, request }) => {
  await resetAirtable(request);
  await loginByApi(page, request);
});

// the seed: "Welcome" was sent to Anna and Celina
const openWelcome = async (page: import("@playwright/test").Page) => {
  await page.goto("/#/job-offers");
  await listRow(page, "Welcome").getByRole("cell").nth(2).click();
  await expect(page).toHaveURL(/#\/job-offers\/recCampSent00002$/);
};

test("shows who got a sent job offer", async ({ page }) => {
  await openWelcome(page);

  await expect(page.getByRole("heading", { name: /Welcome/ })).toBeVisible();
  await expect(page.getByText("2 candidates", { exact: true })).toBeVisible();
  const recipients = page.getByRole("list", { name: "Recipients" }).getByRole("listitem");
  await expect(recipients).toHaveCount(2);
  await expect(recipients.nth(0)).toContainText("anna@example.com");
  await expect(recipients.nth(1)).toContainText("celina@example.com");
});

test("opens an e-mail as its recipient got it", async ({ page }) => {
  await openWelcome(page);

  await page.getByRole("button", { name: "View e-mail to Anna Nowak" }).click();

  // the preview has an address of its own
  await expect(page).toHaveURL(/\?email=recEmailAnna0001$/);
  const panel = page.getByRole("dialog");
  await expect(panel).toContainText("to Anna Nowak <anna@example.com>");
  await expect(panel).toContainText("Talent Outreach <offers@example.com>");
  const email = page.frameLocator('iframe[title="E-mail to anna@example.com"]');
  await expect(email.getByText("Hello Anna,")).toBeVisible();
  await expect(email.getByText("Hello new candidates")).toBeVisible();
  await expect(email.getByRole("link", { name: "Opt out" })).toHaveAttribute(
    "href",
    /#\/opt-out\/recSubAnna000001\.[\w-]+$/
  );

  // "back" closes the preview
  await page.goBack();
  await expect(panel).toHaveCount(0);
});

test("personalizes a draft and previews it for each recipient before sending", async ({
  page,
}) => {
  await page.goto("/#/job-offers/edit/recCampDraft0001");

  await page.getByLabel("Subject").fill("{{name}}, autumn sale");
  await page.getByLabel("Message").fill("Dear {{name}}, 30% off for you.");

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
  await expect(page).toHaveURL(/#\/job-offers\/edit\/recCampDraft0001$/);
});

test("points out a mistyped placeholder", async ({ page }) => {
  await page.goto("/#/job-offers/edit/recCampDraft0001");

  await page.getByLabel("Message").fill("Dear {{nmae}}");
  await page.getByRole("button", { name: "Preview" }).click();

  await expect(
    page.getByText("unknown placeholder {{nmae}} - use {{name}}, {{surname}} or {{role}}")
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("exports who got a sent job offer as CSV", async ({ page }) => {
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

test("exports every e-mail of the sent job offers shown in the list", async ({ page }) => {
  await page.goto("/#/job-offers");

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const file = await download;

  expect(file.suggestedFilename()).toMatch(/^sent-emails-\d{4}-\d{2}-\d{2}\.csv$/);
  const lines = fs.readFileSync(await file.path(), "utf8").trim().split(/\r?\n/);
  expect(lines).toEqual([
    "jobOffer,name,email,sentAt",
    "Welcome,Anna Nowak,anna@example.com,2022-09-06T10:00:00.000Z",
    "Welcome,Celina Wiśniewska,celina@example.com,2022-09-06T10:00:00.000Z",
  ]);

  // only drafts in the list - nothing to export
  await page.locator("#status-filter").click();
  await page.getByRole("option", { name: "Draft" }).click();
  await expect(page.getByRole("button", { name: "Export CSV" })).toBeDisabled();
});

test("a candidate's panel lists the job offers they got", async ({ page }) => {
  await page.goto("/#/candidates?view=recSubAnna000001");

  const received = page.getByRole("list", { name: "Job offers received" });
  await expect(received.getByRole("link")).toHaveCount(1);
  await received.getByRole("link", { name: /Welcome/ }).click();

  // the e-mail she got opens at once
  await expect(page).toHaveURL(/#\/job-offers\/recCampSent00002\?email=recEmailAnna0001$/);
  await expect(
    page.frameLocator('iframe[title="E-mail to anna@example.com"]').getByText("Hello Anna,")
  ).toBeVisible();
});

test("a candidate who got nothing yet", async ({ page }) => {
  await page.goto("/#/candidates?view=recSubDarek00004");

  await expect(page.getByRole("dialog").getByText("No job offers yet.")).toBeVisible();
});

test("a sent job offer's menu leads to its recipients", async ({ page }) => {
  await page.goto("/#/job-offers");

  await rowAction(page, "Welcome", "View recipients");

  await expect(page).toHaveURL(/#\/job-offers\/recCampSent00002$/);
});

test("opts out with the link from an e-mail - without logging in", async ({
  page,
  browser,
  request,
}) => {
  await openWelcome(page);
  await page.getByRole("button", { name: "View e-mail to Anna Nowak" }).click();
  const link = await page
    .frameLocator('iframe[title="E-mail to anna@example.com"]')
    .getByRole("link", { name: "Opt out" })
    .getAttribute("href");

  // a visitor who is not logged in
  const visitor = await (await browser.newContext()).newPage();
  await visitor.goto(link!);

  await expect(visitor.getByRole("heading", { name: "Opt out?" })).toBeVisible();
  await expect(visitor.getByText("anna@example.com")).toBeVisible();
  await visitor.getByRole("button", { name: "Opt out" }).click();
  await expect(visitor.getByRole("heading", { name: "You opted out" })).toBeVisible();

  const anna = (await getAirtable(request)).candidates.find(
    ({ id }) => id === "recSubAnna000001"
  );
  expect(anna?.fields.status).toBe("opted out");

  // the same link again: already done
  await visitor.reload();
  await expect(visitor.getByRole("heading", { name: "You opted out" })).toBeVisible();

  // she is not a recipient any more
  await page.goto("/#/job-offers/add");
  await expect(page.getByText("Goes to 1 candidate", { exact: true })).toBeVisible();
  await page.goto("/#/candidates");
  await expect(listRow(page, "Anna")).toContainText("Opted out");
});

test("refuses a link that is not valid", async ({ browser }) => {
  const visitor = await (await browser.newContext()).newPage();

  await visitor.goto("/#/opt-out/recSubAnna000001.forged-signature");

  await expect(visitor.getByRole("heading", { name: "This link is not valid" })).toBeVisible();
  await expect(visitor.getByRole("button", { name: "Opt out" })).toHaveCount(0);
});
