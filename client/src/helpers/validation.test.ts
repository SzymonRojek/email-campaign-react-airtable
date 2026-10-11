import { validationJobOffer, validationCandidate } from "helpers";
import validationFeedback from "helpers/validationFeedback";

const validCandidate = {
  name: "Łukasz",
  surname: "Żółć",
  email: "lukasz@example.com",
  status: "open to offers",
  role: "tester",
  expectedSalary: "3000",
  phone: "343-234-2344",
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

describe("validationCandidate", () => {
  it("accepts a valid candidate with Polish letters", async () => {
    expect(await errorsOf(validationCandidate, validCandidate)).toEqual([]);
  });

  it.each([
    ["name", "Jo", "must be at least 3 characters"],
    ["name", "Anna_1", "only letters are required"],
    ["surname", "[]^_`", "only letters are required"],
    ["email", "not-an-email", "email is invalid"],
    ["status", "select status", "status is required"],
    ["expectedSalary", "12a", "only numbers are required"],
    ["phone", "12345", "type only 10 digits"],
  ])("rejects %s = %p", async (field, value, message) => {
    const errors = await errorsOf(validationCandidate, {
      ...validCandidate,
      [field]: value,
    });

    expect(errors).toContain(message);
  });
});

describe("validationCandidate - optional fields", () => {
  it("needs only the name, the surname, the e-mail and the status", async () => {
    expect(
      await errorsOf(validationCandidate, {
        name: "Emma",
        surname: "Johnson",
        email: "emma@example.com",
        status: "awaiting consent",
        role: "",
        expectedSalary: "",
        phone: "",
      })
    ).toEqual([]);
  });

  it("still checks an optional field when it is filled in", async () => {
    const errors = await errorsOf(validationCandidate, {
      ...validCandidate,
      role: "<b>QA</b>",
      expectedSalary: "12",
      phone: "123",
    });

    expect(errors).toEqual([
      "use letters, digits and - + / . # &",
      "must be at least 3 numbers",
      "type only 10 digits",
    ]);
  });

  it.each(["Frontend Developer", "QA Engineer", "C++ Developer", "UX/UI Designer", "Node.js Developer"])(
    "accepts a real job title as the role: %s",
    async (role) => {
      expect(await errorsOf(validationCandidate, { ...validCandidate, role })).toEqual([]);
    }
  );

  it("limits the role to 30 characters", async () => {
    expect(
      await errorsOf(validationCandidate, { ...validCandidate, role: "x".repeat(31) })
    ).toEqual(["must not exceed 30 characters"]);
  });
});

describe("validationJobOffer", () => {
  it("requires a subject and a message", async () => {
    expect(await errorsOf(validationJobOffer, {})).toEqual([
      "subject is required",
      "message is required",
    ]);
  });

  it("limits the subject length", async () => {
    const errors = await errorsOf(validationJobOffer, {
      subject: "x".repeat(61),
      message: "ok message",
    });

    expect(errors).toEqual(["must not exceed 60 characters"]);
  });

  it("allows a 500-character message, not longer", async () => {
    const valid = { subject: "Sale", message: "x".repeat(500) };

    expect(await errorsOf(validationJobOffer, valid)).toEqual([]);
    expect(await errorsOf(validationJobOffer, { ...valid, message: "x".repeat(501) })).toEqual([
      "must not exceed 500 characters",
    ]);
  });

  it("knows {{name}} and {{surname}} and points out a typo", async () => {
    expect(
      await errorsOf(validationJobOffer, { subject: "{{name}}, hi", message: "Dear {{ surname }}" })
    ).toEqual([]);
    expect(
      await errorsOf(validationJobOffer, { subject: "Hello", message: "Dear {{nmae}}" })
    ).toEqual(["unknown placeholder {{nmae}} - use {{name}}, {{surname}} or {{role}}"]);
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
