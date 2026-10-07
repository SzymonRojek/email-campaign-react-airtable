import { expect, test } from "@playwright/test";

import { loginByApi, mainNavLink, resetAirtable } from "./helpers";

test.beforeEach(async ({ page, request }) => {
  await resetAirtable(request);
  await loginByApi(page, request);
});

test("navigates with the main tabs", async ({ page }) => {
  await page.goto("/");

  await mainNavLink(page, "Subscribers").click();
  await expect(page.getByRole("heading", { name: "Subscribers" })).toBeVisible();

  await mainNavLink(page, "Campaigns").click();
  await expect(page.getByRole("heading", { name: "Campaigns" })).toBeVisible();

  await mainNavLink(page, "Dashboard").click();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
});

test("keeps the page after a reload", async ({ page }) => {
  await page.goto("/#/campaigns/add");
  await page.reload();

  await expect(page.getByRole("heading", { name: "New campaign" })).toBeVisible();
});

test("opens the add forms from the lists", async ({ page }) => {
  await page.goto("/#/subscribers");
  await page.getByRole("main").getByRole("button", { name: "Add subscriber" }).click();
  await expect(page.getByRole("heading", { name: "New subscriber" })).toBeVisible();

  // an untouched form closes without a question
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.goto("/#/campaigns");
  await page.getByRole("main").getByRole("link", { name: "New campaign" }).click();
  await expect(page.getByRole("heading", { name: "New campaign" })).toBeVisible();
});

test("shows the not found page for an unknown address", async ({ page }) => {
  await page.goto("/#/does-not-exist");

  await expect(page.getByText("Page Not Found")).toBeVisible();
});

test("shows an error for a missing subscriber", async ({ page }) => {
  // the old details address opens the panel
  await page.goto("/#/subscribers/details/recDoesNotExist0");
  await expect(page).toHaveURL(/#\/subscribers\?view=recDoesNotExist0$/);

  await expect(page.getByText("Subscriber does not exist!").first()).toBeVisible({
    timeout: 15_000,
  });
});

test("navigates with the mobile menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByRole("button", { name: "open menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile" })
    .getByRole("link", { name: "Subscribers" })
    .click();

  await expect(page.getByRole("heading", { name: "Subscribers" })).toBeVisible();
  // the menu closes after choosing a page
  await expect(page.getByRole("navigation", { name: "Mobile" })).toHaveCount(0);
});

test("shows the numbers on the dashboard", async ({ page }) => {
  await page.goto("/");

  const stat = (label: string) =>
    page.getByRole("main").getByRole("link").filter({ hasText: label });

  // 4 subscribers (Anna, Celina active), 1 of 2 campaigns sent
  await expect(stat("Active subscribers")).toContainText("2");
  await expect(stat("Campaigns sent")).toContainText("1");
  await expect(stat("Campaigns sent")).toContainText("1 draft waiting");
  await expect(
    page.getByRole("list", { name: "Newest subscribers" }).getByRole("listitem").first()
  ).toContainText("Darek");
});

test("switches to dark mode and keeps it after a reload", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("radio", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("radio", { name: "Dark" })).toHaveAttribute(
    "aria-checked",
    "true"
  );
});
