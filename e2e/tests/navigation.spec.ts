import { expect, test } from "@playwright/test";

import { loginByApi, resetAirtable } from "./helpers";

test.beforeEach(async ({ page, request }) => {
  await resetAirtable(request);
  await loginByApi(page, request);
});

test("navigates with the main tabs", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("tab", { name: "Subscribers" }).click();
  await expect(page.getByRole("heading", { name: "all subscribers" })).toBeVisible();

  await page.getByRole("tab", { name: "Campaigns" }).click();
  await expect(page.getByRole("heading", { name: "all emails" })).toBeVisible();

  await page.getByRole("tab", { name: "Home" }).click();
  await expect(page.getByRole("heading", { name: /Hello/ })).toBeVisible();
});

test("keeps the page after a reload", async ({ page }) => {
  await page.goto("/#/campaigns/status");
  await page.reload();

  await expect(page.getByRole("heading", { name: "email status" })).toBeVisible();
});

test("shows the not found page for an unknown address", async ({ page }) => {
  await page.goto("/#/does-not-exist");

  await expect(page.getByText("Page Not Found")).toBeVisible();
});

test("shows an error for a missing subscriber", async ({ page }) => {
  await page.goto("/#/subscribers/details/recDoesNotExist0");

  await expect(page.getByText("Subscriber does not exist!").first()).toBeVisible({
    timeout: 15_000,
  });
});
