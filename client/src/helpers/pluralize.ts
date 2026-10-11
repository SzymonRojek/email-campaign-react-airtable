// "1 candidate", "7 candidates"
const pluralize = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? "" : "s"}`;

export default pluralize;
