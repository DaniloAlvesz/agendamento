export function getTimeZoneOffsetMinutes(date: Date, timeZone: string) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  const parts = dtf.formatToParts(date);
  const values: Record<string, string> = {};
  parts.forEach((part) => {
    if (part.type !== "literal") values[part.type] = part.value;
  });
  const utcTime = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );
  return (utcTime - date.getTime()) / 60000;
}

export function zonedTimeToUtc(date: Date, timeZone: string) {
  const offset = getTimeZoneOffsetMinutes(date, timeZone);
  return new Date(date.getTime() - offset * 60000);
}

export function utcToZonedTime(date: Date, timeZone: string) {
  const offset = getTimeZoneOffsetMinutes(date, timeZone);
  return new Date(date.getTime() + offset * 60000);
}

export function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
}

export function getWeekdayFromDate(dateString: string, timeZone: string) {
  const utcNoon = new Date(`${dateString}T12:00:00Z`);
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short"
  }).format(utcNoon);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6
  };
  return map[weekday] ?? 0;
}

export function parseTimeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = Math.floor(minutes % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}`;
}
