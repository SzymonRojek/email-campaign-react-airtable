// the Airtable settings of the server, from the environment variables
//   AIRTABLE_BASE_ID  the base the app works on ("app..." from the base's address)
//   AIRTABLE_TOKEN    a personal access token ("pat....") with access to that base
//   AIRTABLE_API_URL  only for tests - points the server at a fake Airtable
// the old names REACT_APP_DB_ID / REACT_APP_API_KEY still work, so a server
// keeps running until its variables are renamed
export const airtableConfig = (env: NodeJS.ProcessEnv = process.env) => {
  const baseId = env.AIRTABLE_BASE_ID || env.REACT_APP_DB_ID;
  const token = env.AIRTABLE_TOKEN || env.REACT_APP_API_KEY;
  const oldNames = [
    !env.AIRTABLE_BASE_ID && env.REACT_APP_DB_ID && "REACT_APP_DB_ID -> AIRTABLE_BASE_ID",
    !env.AIRTABLE_TOKEN && env.REACT_APP_API_KEY && "REACT_APP_API_KEY -> AIRTABLE_TOKEN",
  ].filter(Boolean) as string[];

  return {
    apiUrl: env.AIRTABLE_API_URL || "https://api.airtable.com/v0",
    baseId,
    token,
    // variables to rename on the server (shown in the log at start)
    oldNames,
  };
};
