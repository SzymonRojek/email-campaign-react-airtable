import { expect, test } from "@playwright/test";

import { getAirtable, loginByApi, resetAirtable } from "./helpers";

test.beforeEach(async ({ request }) => {
  await resetAirtable(request);
});

test("the login page shows what reviewers say - only the approved public feedback", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.getByRole("region", { name: "What reviewers say" });
  // the newest three of the four
  const quotes = section.getByRole("figure");
  await expect(quotes).toHaveCount(3);
  await expect(quotes.nth(0)).toContainText("Easy to use.");
  await expect(quotes.nth(1)).toContainText("Jan Nowak");
  await expect(quotes.nth(1)).toContainText("Backend Developer");
  await expect(quotes.nth(2)).toContainText("Nice UX, works on my phone.");
  await expect(section).not.toContainText("Marta Kowalska");
  await expect(section).not.toContainText("Only for the owner.");
  await expect(section).not.toContainText("Waiting for a review.");
});

test("anybody can leave feedback - it waits for a review", async ({ page, request }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /Leave feedback/ }).click();
  const dialog = page.getByRole("dialog", { name: "Leave feedback" });

  // the form checks the fields first
  await dialog.getByRole("button", { name: "Send feedback" }).click();
  await expect(dialog.getByText("name is required")).toBeVisible();

  await dialog.getByLabel("Name", { exact: true }).fill("Ola");
  await dialog.getByLabel("Role (optional)").fill("QA Engineer");
  await dialog.getByLabel("Your feedback").fill("The e2e tests are impressive.");
  await dialog.getByLabel("Show my name, role and feedback in the app").check();
  await dialog.getByRole("button", { name: "Send feedback" }).click();

  await expect(dialog.getByText("Thank you for your feedback!")).toBeVisible();
  const saved = (await getAirtable(request)).feedback.find(
    ({ fields }) => fields.name === "Ola"
  );
  expect(saved?.fields).toMatchObject({
    role: "QA Engineer",
    message: "The e2e tests are impressive.",
    isPublic: true,
    approved: false,
  });

  // not shown before the review
  await dialog.getByRole("button", { name: "Close" }).first().click();
  await expect(page.getByText("The e2e tests are impressive.")).toHaveCount(0);
});

test("the Feedback page in the app lists all approved public feedback", async ({
  page,
  request,
}) => {
  await loginByApi(page, request);
  await page.goto("/#/");

  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Feedback" }).click();

  await expect(page).toHaveURL(/#\/feedback$/);
  const list = page.getByRole("list", { name: "Feedback" }).getByRole("listitem");
  await expect(list).toHaveCount(4);
  await expect(page.getByText("4 reviews", { exact: false })).toBeVisible();
  await expect(page.getByText("Only for the owner.")).toHaveCount(0);

  await page.getByRole("button", { name: "Leave feedback" }).click();
  await expect(page.getByRole("dialog", { name: "Leave feedback" })).toBeVisible();
});
