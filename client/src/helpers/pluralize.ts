// "1 subscriber", "7 subscribers"
const pluralize = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? "" : "s"}`;

export default pluralize;
