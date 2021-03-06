const getLatestAddedItem = (data) => {
  if (!data) return [];

  return [...data]
    .sort((a, b) => (a.createdTime > b.createdTime ? 1 : -1))
    .slice(-1);
};

export default getLatestAddedItem;
