// no date given = now (same as moment() before)
const toDate = (value?: string) => (value ? new Date(value) : new Date());

const pad = (value: number) => String(value).padStart(2, "0");

// "YYYY/MM/DD", e.g. 2022/09/06
const getFormattedDate = (date?: string) => {
  const d = toDate(date);

  if (Number.isNaN(d.getTime())) return "Invalid date";

  return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
};

// "h:mm am/pm", e.g. 9:05 pm
const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const getFormattedTime = (time?: string) => {
  const d = toDate(time);

  if (Number.isNaN(d.getTime())) return "Invalid date";

  const parts = timeFormat.formatToParts(d);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return `${part("hour")}:${part("minute")} ${part("dayPeriod").toLowerCase()}`;
};

const formattedData = { getFormattedDate, getFormattedTime };

export default formattedData;
