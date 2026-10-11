import * as Yup from "yup";

import { unknownPlaceholders } from "./placeholders";

export const DESCRIPTION_MAX = 500;

const knownPlaceholders = (schema: Yup.StringSchema) =>
  schema.test("placeholders", "", (value, context) => {
    const unknown = unknownPlaceholders(value);
    return unknown.length === 0
      ? true
      : context.createError({
          message: `unknown placeholder ${unknown.map((key) => `{{${key}}}`).join(", ")} - use {{name}}, {{surname}} or {{role}}`,
        });
  });

const validationCampaign = Yup.object({
  title: knownPlaceholders(
    Yup.string()
      .required("subject is required")
      .trim()
      .min(3, "must be at least 3 characters")
      .max(60, "must not exceed 60 characters")
  ),
  description: knownPlaceholders(
    Yup.string()
      .required("message is required")
      .trim()
      .min(3, "must be at least 3 characters")
      .max(DESCRIPTION_MAX, `must not exceed ${DESCRIPTION_MAX} characters`)
  ),
});

export default validationCampaign;
