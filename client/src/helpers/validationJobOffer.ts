import * as Yup from "yup";

import { unknownPlaceholders } from "./placeholders";

export const MESSAGE_MAX = 500;

const knownPlaceholders = (schema: Yup.StringSchema) =>
  schema.test("placeholders", "", (value, context) => {
    const unknown = unknownPlaceholders(value);
    return unknown.length === 0
      ? true
      : context.createError({
          message: `unknown placeholder ${unknown.map((key) => `{{${key}}}`).join(", ")} - use {{name}}, {{surname}} or {{role}}`,
        });
  });

const validationJobOffer = Yup.object({
  subject: knownPlaceholders(
    Yup.string()
      .required("subject is required")
      .trim()
      .min(3, "must be at least 3 characters")
      .max(60, "must not exceed 60 characters")
  ),
  message: knownPlaceholders(
    Yup.string()
      .required("message is required")
      .trim()
      .min(3, "must be at least 3 characters")
      .max(MESSAGE_MAX, `must not exceed ${MESSAGE_MAX} characters`)
  ),
});

export default validationJobOffer;
