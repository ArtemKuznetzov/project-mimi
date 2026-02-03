type DateStyle = NonNullable<Intl.DateTimeFormatOptions["dateStyle"]>;
type TimeStyle = NonNullable<Intl.DateTimeFormatOptions["timeStyle"]>;

type FormatMessageTimeOptions = {
  dateStyle?: DateStyle;
  timeStyle?: TimeStyle;
};

export const formatMessageTime = (
  value: string | Date,
  { dateStyle, timeStyle = "short" }: FormatMessageTimeOptions = {}
) =>
  new Intl.DateTimeFormat(navigator.language, {
    dateStyle,
    timeStyle,
  }).format(new Date(value));

export const getDateStr = (iso?: string) => {
  if (!iso)
    return ""

  const serverDate = new Date(iso)
  const clientDate = new Date()
  const clientDateToday = new Date(clientDate.getFullYear(), clientDate.getMonth(), clientDate.getDate())
  const clientDateYesterday = new Date(clientDateToday)
  clientDateYesterday.setDate(clientDate.getDate() - 1)

  if (serverDate >= clientDateToday) {
    return "Today"
  }

  if (serverDate >= clientDateYesterday && serverDate < clientDateToday) {
    return "Yesterday";
  }

  return formatMessageTime(serverDate, { dateStyle: "short", timeStyle: "short" })
}