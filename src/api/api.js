const baseUrl = "https://api.airtable.com/v0";
const ID_BASE = "appn4qP4vZb4Ut2R0";
export const apiConfig = {
  subscribers: `${baseUrl}/${ID_BASE}/subscribers`,
  campaigns: `${baseUrl}/${ID_BASE}/campaigns`,
};
const apiKey = "keyv2KEwRTEhfwd8x";
const requestConfig = {
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
};

export const getSubscribers = async (endpoint) => {
  const response = await fetch(endpoint, {
    method: "GET",
    ...requestConfig,
  });
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;

    throw new Error(message);
  }
  const data = await response.json();

  return data.records;
};
