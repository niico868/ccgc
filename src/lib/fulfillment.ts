// Fulfillment / salad-day helpers using Trinidad & Tobago local time.
// Salad days are Monday, Wednesday and Friday. Same-day orders are permitted only
// before 8:00 AM local time. After 8:00 AM the current day is no longer
// selectable and customers must pick the next available salad day.

const TT_TZ = "America/Port_of_Spain";

type TTParts = { year: number; month: number; day: number; hour: number; minute: number; weekday: number };

// weekday index: Sunday = 0 ... Saturday = 6
const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};

export function ttParts(now: Date = new Date()): TTParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TT_TZ,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    weekday: WEEKDAY_INDEX[parts.weekday as string] ?? 0,
  };
}

export const CUTOFF_HOUR = 8; // 8:00 AM T&T time on salad days
export const SALAD_WEEKDAYS = [1, 3, 5]; // Mon, Wed, Fri

export function isSaladWeekday(weekday: number) {
  return SALAD_WEEKDAYS.includes(weekday);
}

/** Is the same-day cutoff still open right now in Trinidad time? */
export function sameDayOpen(now: Date = new Date()): boolean {
  const p = ttParts(now);
  return isSaladWeekday(p.weekday) && p.hour < CUTOFF_HOUR;
}

export type SaladDay = {
  /** ISO date string (YYYY-MM-DD) in Trinidad local calendar. */
  value: string;
  /** Human label, for example "Today, Monday November 24". */
  label: string;
  isToday: boolean;
};

/**
 * Every available salad day within the next `months` months (default 6),
 * from Trinidad's perspective. Used for the scrollable advance booking list.
 */
export function saladDaysAhead(months = 6, now: Date = new Date()): SaladDay[] {
  // Mon + Wed + Fri gives roughly 13 options per month; add a little headroom.
  const p = ttParts(now);
  const end = new Date(Date.UTC(p.year, p.month - 1 + months, p.day));
  return nextSaladDays(100, now, months * 31 + 7).filter((d) => d.value <= end.toISOString().slice(0, 10));
}

/** Return the next N available salad days from Trinidad's perspective. */
export function nextSaladDays(count = 4, now: Date = new Date(), horizonDays = 21): SaladDay[] {
  const p = ttParts(now);
  const todayStr = `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
  const base = new Date(Date.UTC(p.year, p.month - 1, p.day));

  const out: SaladDay[] = [];
  for (let i = 0; out.length < count && i < horizonDays; i++) {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() + i);
    const wd = d.getUTCDay();
    if (!isSaladWeekday(wd)) continue;
    const value = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    const isToday = value === todayStr;
    // Skip today if the same-day cutoff has passed.
    if (isToday && p.hour >= CUTOFF_HOUR) continue;
    const long = d.toLocaleDateString("en-TT", {
      timeZone: "UTC", weekday: "long", month: "long", day: "numeric",
    });
    const label = isToday ? `Today, ${long}` : long;
    out.push({ value, label, isToday });
  }
  return out;
}
