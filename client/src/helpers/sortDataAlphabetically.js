const sortDataAlphabetically = (data) => {
  if (!data) return [];

  const copyData = [...data];
  // const isName =
  //   copyData.map((item) => item.fields.name).filter(Boolean).length > 0;

  const nestedPropertyRetriever = (obj) =>
    obj.fields.hasOwnProperty("name")
      ? obj.fields.name.toLowerCase()
      : obj.fields.title.toLowerCase();

  return copyData.sort((a, b) => {
    const valueA = nestedPropertyRetriever(a);
    const valueB = nestedPropertyRetriever(b);

    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
  });
};

export default sortDataAlphabetically;
