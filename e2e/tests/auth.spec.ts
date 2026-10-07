import { expect, test } from "@playwright/test";

import {
  loginByApi,
  loginByForm,
  mainNavLink,
  resetAirtable,
} from "./helpers";

test.beforeEach(async ({ request }) => {
  await resetAirtable(request);
});

test.describe("login", () => {
  test("shows the login form with the demo password hint", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Email Campaign" })
    ).toBeVisible();
    await expect(page.getByText("the password is", { exact: false })).toContainText(
      "admin"
    );
  });

  test("rejects a wrong password", async ({ page }) => {
    await page.goto("/");

    await loginByForm(page, "wrong-password");

    await expect(page.getByText("password is not correct")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Email Campaign" })
    ).toBeVisible();
  });

  test("asks only for the password", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByLabel("Confirm password")).toHaveCount(0);
    await page.getByRole("button", { name: "Log in" }).click();

    await expect(page.getByText("please enter your password")).toBeVisible();
  });

  test("logs in and out", async ({ page }) => {
    await page.goto("/");

    await loginByForm(page);

    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({
      timeout: 10_000,
    });

    await page.getByRole("button", { name: "Log out" }).click();

    await expect(
      page.getByRole("heading", { name: "Email Campaign" })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("goes back to the login form when the token is no longer valid", async ({
    page,
    request,
  }) => {
    await loginByApi(page, request);
    await page.goto("/#/subscribers");
    await expect(page.getByRole("heading", { name: "Subscribers" })).toBeVisible();

    // e.g. the token expired or the server secret changed
    await page.evaluate(() => localStorage.setItem("authToken", "invalid.token"));
    await mainNavLink(page, "Campaigns").click();

    await expect(
      page.getByRole("heading", { name: "Email Campaign" })
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
