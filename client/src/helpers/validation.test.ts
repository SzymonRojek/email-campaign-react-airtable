import { validationCampaign, validationLogin, validationSubscriber } from "helpers";
import validationFeedback from "helpers/validationFeedback";

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

describe("validationSubscriber - optional fields", () => {
  it("needs only the name, the surname, the e-mail and the status", async () => {
    expect(
      await errorsOf(validationSubscriber, {
        name: "Emma",
        surname: "Johnson",
        email: "emma@example.com",
        status: "pending",
        profession: "",
        salary: "",
        telephone: "",
      })
    ).toEqual([]);
  });

  it("still checks an optional field when it is filled in", async () => {
    const errors = await errorsOf(validationSubscriber, {
      ...validSubscriber,
      profession: "QA2",
      salary: "12",
      telephone: "123",
    });

    expect(errors).toEqual([
      "only letters are required",
      "must be at least 3 numbers",
      "type only 10 digits",
    ]);
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

  it("allows a 500-character description, not longer", async () => {
    const valid = { title: "Sale", description: "x".repeat(500) };

    expect(await errorsOf(validationCampaign, valid)).toEqual([]);
    expect(await errorsOf(validationCampaign, { ...valid, description: "x".repeat(501) })).toEqual([
      "must not exceed 500 characters",
    ]);
  });

  it("knows {{name}} and {{surname}} and points out a typo", async () => {
    expect(
      await errorsOf(validationCampaign, { title: "{{name}}, hi", description: "Dear {{ surname }}" })
    ).toEqual([]);
    expect(
      await errorsOf(validationCampaign, { title: "Hello", description: "Dear {{nmae}}" })
    ).toEqual(["unknown placeholder {{nmae}} - use {{name}} or {{surname}}"]);
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

describe("validationFeedback", () => {
  it("needs a name and the feedback - the role is optional", async () => {
    expect(await errorsOf(validationFeedback, {})).toEqual([
      "name is required",
      "feedback is required",
    ]);
    expect(await errorsOf(validationFeedback, { name: "Anna", message: "Nice work" })).toEqual([]);
  });

  it("limits the length like the server", async () => {
    expect(
      await errorsOf(validationFeedback, {
        name: "x".repeat(41),
        role: "x".repeat(41),
        message: "x".repeat(501),
      })
    ).toEqual([
      "must not exceed 40 characters",
      "must not exceed 40 characters",
      "must not exceed 500 characters",
    ]);
  });
});
