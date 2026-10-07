// Airtable: max 10 records per create / delete request, max 5 requests per second
export const BATCH_SIZE = 10;

export const chunks = <T>(items: T[], size = BATCH_SIZE) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, (i + 1) * size)
  );

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
