import request from "supertest";

import { hideSecrets, monitoringOptions } from "../helpers/monitoring";
import { app } from "../app";

describe("error monitoring", () => {
  it("never sends the opt-out token", () => {
    expect(hideSecrets("https://app.example.com/#/opt-out/recAnna.abc-DEF_1")).toBe(
      "https://app.example.com/#/opt-out/[token]"
    );
    expect(hideSecrets("POST /api/opt-out/recAnna.sig?x=1")).toBe(
      "POST /api/opt-out/[token]?x=1"
    );
    expect(hideSecrets("/api/job-offers/rec1")).toBe("/api/job-offers/rec1");
  });

  it("collects no personal data, headers, bodies or variables", () => {
    expect(monitoringOptions().dataCollection).toEqual({
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      stackFrameVariables: false,
    });
  });

  it("cleans the event before it leaves the server", () => {
    const { beforeSend } = monitoringOptions();
    const event = beforeSend!(
      {
        type: undefined,
        request: { url: "https://app/api/opt-out/recA.sig" },
        breadcrumbs: [{ data: { url: "/api/opt-out/recA.sig" } }],
      },
      {}
    ) as unknown as { request: { url: string }; breadcrumbs: { data: { url: string } }[] };

    expect(event.request.url).toBe("https://app/api/opt-out/[token]");
    expect(event.breadcrumbs[0].data.url).toBe("/api/opt-out/[token]");
  });

  it("answers a broken request with JSON, not an HTML page", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send('{"password": ');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ status: "fail", error: "The request is not valid" });
  });
});
