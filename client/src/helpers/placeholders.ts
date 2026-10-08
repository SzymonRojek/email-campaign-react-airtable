// {{name}} and {{surname}} in a campaign become each recipient's own data
// (the server fills them in - the same list lives in server/mail/buildEmail.ts)
export const PLACEHOLDERS = ["name", "surname"] as const;

const placeholderPattern = /\{\{\s*([^{}]*?)\s*\}\}/g;

// e.g. a typo: {{nmae}}
export const unknownPlaceholders = (text = "") => [
  ...new Set(
    [...text.matchAll(placeholderPattern)]
      .map(([, key]) => key)
      .filter((key) => !(PLACEHOLDERS as readonly string[]).includes(key))
  ),
];
