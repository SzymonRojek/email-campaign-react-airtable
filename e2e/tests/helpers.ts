import { APIRequestContext, Page, expect } from "@playwright/test";

import { ADMIN_PASSWORD, AIRTABLE_PORT } from "../seed";

const airtableUrl = `http://localhost:${AIRTABLE_PORT}`;

export const resetAirtable = async (request: APIRequestContext) => {
  const res = await request.post(`${airtableUrl}/__reset`);
  expect(res.ok()).toBe(true);
};

export const getAirtable = async (request: APIRequestContext) => {
  const res = await request.get(`${airtableUrl}/__db`);
  return res.json() as Promise<
    Record<string, { id: string; fields: Record<string, string> }[]>
  >;
};

export const getToken = async (request: APIRequestContext) => {
  const res = await request.post("/api/auth/login", {
    data: { password: ADMIN_PASSWORD },
  });
  expect(res.ok()).toBe(true);
  return ((await res.json()) as { token: string }).token;
};

// skips the login form (and its 3s loader) - the UI login has its own tests
export const loginByApi = async (page: Page, request: APIRequestContext) => {
  const token = await getToken(request);

  await page.addInitScript((authToken) => {
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("login", "true");
  }, token);
};

export const loginByForm = async (page: Page, password = ADMIN_PASSWORD) => {
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
};

// the first table on the page is the full list ("latest added" is the second one)
export const listRow = (page: Page, text: string) =>
  page.getByRole("table").first().getByRole("row").filter({ hasText: text });

// links of the main navigation in the header (desktop)
export const mainNavLink = (page: Page, name: string) =>
  page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name, exact: true });
