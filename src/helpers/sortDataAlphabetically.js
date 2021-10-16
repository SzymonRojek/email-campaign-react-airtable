const sortDataAlphabetically = (data) => {
  const isName = data.map((x) => x.fields.name).filter(Boolean).length > 0;

  const nestedPropertyRetriever = (obj) =>
    isName ? obj.fields.name.toLowerCase() : obj.fields.title.toLowerCase();

  data.sort((a, b) => {
    const valueA = nestedPropertyRetriever(a);
    const valueB = nestedPropertyRetriever(b);

    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
  });
};

export default sortDataAlphabetically;
