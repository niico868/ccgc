import { ttParts, saladDaysAhead } from "./fulfillment";
import { MENU_A_MEALS, MENU_B_MEALS } from "./menu-data";

const WEEK_MS = 7 * 86400000;
const ANCHOR = Date.UTC(2026, 9, 19);
export function isoDate(date: Date): string { return date.toISOString().slice(0, 10); }
export function calendarDate(iso: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) throw new Error("Choose a valid delivery date.");
  const date = new Date(`${iso}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || isoDate(date) !== iso) throw new Error("Choose a valid delivery date.");
  return date;
}
export function weekMonday(iso: string): string {
  const date = calendarDate(iso);
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6) % 7);
  return isoDate(date);
}
export function addDays(iso: string, days: number): string {
  const date = calendarDate(iso); date.setUTCDate(date.getUTCDate() + days); return isoDate(date);
}
export function menuForDate(deliveryDate: string): "A" | "B" {
  const weeks = Math.round((calendarDate(weekMonday(deliveryDate)).getTime() - ANCHOR) / WEEK_MS);
  return ((weeks % 2) + 2) % 2 === 0 ? "A" : "B";
}
export function currentMenuWeekMonday(now = new Date()): string {
  const p = ttParts(now);
  const today = isoDate(new Date(Date.UTC(p.year, p.month - 1, p.day)));
  const monday = weekMonday(today);
  const switchWeek = p.weekday === 6 || p.weekday === 0 || (p.weekday === 5 && p.hour >= 8);
  return switchWeek ? addDays(monday, 7) : monday;
}
export function mealsForDate(date: string) { return menuForDate(date) === "A" ? MENU_A_MEALS : MENU_B_MEALS; }
export function activeMeals(now = new Date()) { return mealsForDate(currentMenuWeekMonday(now)); }
export function shortDay(iso: string) {
  return calendarDate(iso).toLocaleDateString("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" });
}
export function menuWeekLabel(date: string) {
  const monday = weekMonday(date);
  return `Menu for deliveries ${shortDay(monday)}, ${shortDay(addDays(monday, 2))} & ${shortDay(addDays(monday, 4))}`;
}
export const PICKUP_LOCATIONS = ["Trincity (2 PM to 5 PM)", "St. Clair (11 AM to 1 PM)"] as const;
export function unavailableMeals(items: { itemId: string; category: string }[], date: string) {
  if (!date) return items.filter((i) => i.category === "meal");
  const available = new Set(mealsForDate(date).map((i) => i.id));
  return items.filter((i) => (i.category === "meal" || i.itemId.startsWith("meal-")) && !available.has(i.itemId));
}
export function validateOrderAvailability(items: { itemId: string; category: string }[], date: string, now = new Date()) {
  if (!saladDaysAhead(6, now).some((day) => day.value === date)) throw new Error("Choose an available Monday, Wednesday or Friday within six months. Same-day orders close at 8 AM Trinidad time.");
  if (unavailableMeals(items, date).length) throw new Error("Some meals are not available for your chosen week. Remove them or change the date.");
}