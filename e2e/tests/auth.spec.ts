import { expect, test } from "@playwright/test";

import { loginByApi, mainNavLink, resetAirtable } from "./helpers";

test.beforeEach(async ({ request }) => {
  await resetAirtable(request);
});

test.describe("login", () => {
  test("opens the demo with one click - no password - and logs out", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByLabel(/password/i)).toHaveCount(0);
    await page.getByRole("button", { name: "Try the demo" }).click();

    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({
      timeout: 10_000,
    });

    await page.getByRole("button", { name: "Log out" }).click();

    await expect(
      page.getByRole("heading", { name: "Email Campaign Dashboard" })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("goes back to the start page when the token is no longer valid", async ({
    page,
    request,
  }) => {
    await loginByApi(page, request);
    await page.goto("/#/subscribers");
    await expect(page.getByRole("heading", { name: "Candidates" })).toBeVisible();

    // e.g. the token expired or the server secret changed
    await page.evaluate(() => localStorage.setItem("authToken", "invalid.token"));
    await mainNavLink(page, "Job offers").click();

    await expect(
      page.getByRole("heading", { name: "Email Campaign Dashboard" })
    ).toBeVisible();
  });
});

test.describe("api", () => {
  test("requires a token", async ({ request }) => {
    const res = await request.get("/api/subscribers");

    expect(res.status()).toBe(401);
  });

  test("returns json 404 for unknown endpoints", async ({ request }) => {
    const res = await request.get("/api/nope");

    expect(res.status()).toBe(404);
    expect(await res.json()).toEqual({
      status: "fail",
      error: "Endpoint does not exist",
    });
  });
});
