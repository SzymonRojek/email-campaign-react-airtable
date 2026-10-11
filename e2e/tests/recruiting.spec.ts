import { expect, test } from "@playwright/test";

import { getAirtable, listRow, loginByApi, resetAirtable } from "./helpers";

// the recruiter's flow: a job offer for one role, and the next one does not reach the same
// people again too soon (the seed: Anna is a tester, Celina a designer - both open to offers)

test.beforeEach(async ({ page, request }) => {
  await resetAirtable(request);
  await loginByApi(page, request);
});

const pickRole = async (page: import("@playwright/test").Page, role: string) => {
  await page.getByRole("combobox", { name: "Role" }).click();
  await page.getByRole("option", { name: role, exact: true }).click();
};

test("sends a job offer to one role, then skips the ones contacted lately", async ({
  page,
  request,
}) => {
  await page.goto("/#/job-offers/add");
  await expect(page.getByText("Goes to 2 candidates")).toBeVisible();

  await pickRole(page, "tester");
  await expect(page.getByText("Goes to 1 candidate", { exact: true })).toBeVisible();

  await page.locator("#subject").fill("QA Engineer - remote");
  await page.locator("#message").fill("An offer for you as a {{role}}.");
  await page.getByRole("button", { name: "Send email" }).click();
  const confirm = page.getByRole("alertdialog");
  await expect(confirm).toContainText("It goes to 1 candidate.");
  await confirm.getByRole("button", { name: "Send", exact: true }).click();

  // only the tester got it, with the role filled in
  await expect(page).toHaveURL(/#\/job-offers\/recE2E\d+$/);
  const recipients = page.getByRole("list", { name: "Recipients" }).getByRole("listitem");
  await expect(recipients).toHaveCount(1);
  await expect(recipients.first()).toContainText("Anna Nowak");
  await page.getByRole("button", { name: "View e-mail to Anna Nowak" }).click();
  await expect(
    page
      .frameLocator('iframe[title="E-mail to anna@example.com"]')
      .getByText("An offer for you as a tester.")
  ).toBeVisible();

  const { jobOffers, outbox } = await getAirtable(request);
  const offer = jobOffers.find(({ fields }) => fields.subject === "QA Engineer - remote");
  expect(outbox.filter(({ fields }) => fields.jobOfferId === offer?.id)).toHaveLength(1);

  // the list shows who was contacted
  await page.goto("/#/candidates");
  await expect(listRow(page, "Anna Nowak")).toContainText("today");
  await expect(listRow(page, "Celina")).not.toContainText("today");

  // the next offer for testers does not reach Anna again - unless the recruiter says so
  await page.goto("/#/job-offers/add");
  await pickRole(page, "tester");
  const skip = page.getByLabel("Skip 1 candidate contacted in the last 14 days");
  await expect(skip).toBeChecked();
  await expect(page.getByText("Goes to 0 candidates")).toBeVisible();

  await skip.uncheck();
  await expect(page.getByText("Goes to 1 candidate", { exact: true })).toBeVisible();
});

test("finds the candidates within the budget", async ({ page }) => {
  await page.goto("/#/job-offers/add");

  // Anna expects 5000, Celina 6000
  await page.getByLabel("Budget per month").fill("5500");
  await expect(page.getByText("Goes to 1 candidate", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Choose recipients" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("1 of 1 selected")).toBeVisible();
  await expect(dialog.getByLabel(/Anna/)).toBeChecked();
  await expect(dialog.getByText(/Celina/)).toHaveCount(0);
});

test("shows the role and the expected salary of every candidate", async ({ page }) => {
  await page.goto("/#/candidates");

  await expect(listRow(page, "Anna Nowak")).toContainText("tester");
  await expect(listRow(page, "Anna Nowak")).toContainText("5,000 / month");
  await expect(listRow(page, "Anna Nowak")).toContainText("Open to offers");
  await expect(listRow(page, "Darek")).toContainText("Awaiting consent");

  // the search finds the role too
  await page.getByLabel("Search candidates").fill("designer");
  await expect(listRow(page, "Celina")).toBeVisible();
  await expect(listRow(page, "Anna Nowak")).toHaveCount(0);
});
