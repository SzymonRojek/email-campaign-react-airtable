import { validationCampaign, validationLogin, validationSubscriber } from "helpers";

const validSubscriber = {
  name: "Łukasz",
  surname: "Żółć",
  email: "lukasz@example.com",
  status: "active",
  profession: "tester",
  salary: "3000",
  telephone: "343-234-2344",
};

const errorsOf = async (
  schema: { validate: (value: unknown, options: object) => Promise<unknown> },
  value: unknown
) => {
  try {
    await schema.validate(value, { abortEarly: false });
    return [];
  } catch (error) {
    return (error as { errors: string[] }).errors;
  }
};

describe("validationSubscriber", () => {
  it("accepts a valid subscriber with Polish letters", async () => {
    expect(await errorsOf(validationSubscriber, validSubscriber)).toEqual([]);
  });

  it.each([
    ["name", "Jo", "must be at least 3 characters"],
    ["name", "Anna_1", "only letters are required"],
    ["surname", "[]^_`", "only letters are required"],
    ["email", "not-an-email", "email is invalid"],
    ["status", "select status", "status is required"],
    ["salary", "12a", "only numbers are required"],
    ["telephone", "12345", "type only 10 digits"],
  ])("rejects %s = %p", async (field, value, message) => {
    const errors = await errorsOf(validationSubscriber, {
      ...validSubscriber,
      [field]: value,
    });

    expect(errors).toContain(message);
  });
});

describe("validationCampaign", () => {
  it("requires a title and a description", async () => {
    expect(await errorsOf(validationCampaign, {})).toEqual([
      "title is required",
      "description is required",
    ]);
  });

  it("limits the title length", async () => {
    const errors = await errorsOf(validationCampaign, {
      title: "x".repeat(31),
      description: "ok description",
    });

    expect(errors).toEqual(["must not exceed 30 characters"]);
  });
});

describe("validationLogin", () => {
  it("requires a password", async () => {
    expect(await errorsOf(validationLogin, { password: "" })).toEqual([
      "please enter your password",
    ]);
  });

  it("does not check the password itself (the server does)", async () => {
    expect(await errorsOf(validationLogin, { password: "anything" })).toEqual([]);
  });
});
