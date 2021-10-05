const sortDataAlphabetically = (data) => {
  const nestedPropertyRetriever = (obj) => obj.fields.name.toLowerCase();

  data.sort((a, b) => {
    const valueA = nestedPropertyRetriever(a);
    const valueB = nestedPropertyRetriever(b);

    if (valueA < valueB) {
      return -1;
    } else if (valueA > valueB) {
      return 1;
    } else {
      return 0;
    }
  });
};

export default sortDataAlphabetically;
