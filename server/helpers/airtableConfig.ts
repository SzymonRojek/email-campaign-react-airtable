// the Airtable settings of the server, from the environment variables
//   AIRTABLE_BASE_ID  the base the app works on ("app..." from the base's address)
//   AIRTABLE_TOKEN    a personal access token ("pat....") with access to that base
//   AIRTABLE_API_URL  only for tests - points the server at a fake Airtable
export const airtableConfig = (env: NodeJS.ProcessEnv = process.env) => {
  const baseId = env.AIRTABLE_BASE_ID;
  const token = env.AIRTABLE_TOKEN;

  return {
    apiUrl: env.AIRTABLE_API_URL || "https://api.airtable.com/v0",
    baseId,
    token,
    // variables to set on the server (shown in the log at start)
    missing: [!baseId && "AIRTABLE_BASE_ID", !token && "AIRTABLE_TOKEN"].filter(
      Boolean
    ) as string[],
  };
};
