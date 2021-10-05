const sortDataAlphabetically = (data) => {
  const nestedPropertyRetriever = (obj) => obj.fields.name.toLowerCase();

  data.sort((a, b) => {
    const valueA = nestedPropertyRetriever(a);
    const valueB = nestedPropertyRetriever(b);

    return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
  });
};

export default sortDataAlphabetically;
