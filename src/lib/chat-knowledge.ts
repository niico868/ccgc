/**
 * Builds the website assistant's prompt for each message from:
 *  - the brand brain (src/brain/*.md): core voice and rules every time, plus only
 *    the topic files the customer's question needs;
 *  - live hard facts and the menu from site-facts.ts and menu-data.ts, so prices,
 *    days and this week's meals can never drift from the website.
 */
import type { BrainFile } from "./brain";
import { selectBrainFiles } from "./brain";
import { FACTS, SITE_URL } from "./site-facts";
import { ttParts, nextSaladDays } from "./fulfillment";
import { currentMenuWeekMonday, mealsForDate, menuForDate, menuWeekLabel } from "./menu-rotation";
import { JUICES, MENU_A_MEALS, MENU_B_MEALS, SALADS, type MenuItem } from "./menu-data";

/** Marker the model adds when a person should take over; the widget turns it into a WhatsApp button. */
export const HANDOFF_TOKEN = "[HANDOFF]";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export const CHAT_LIMITS = {
  maxTurns: 10,
  maxCharsPerMessage: 600,
} as const;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function nowLine(now: Date) {
  const p = ttParts(now);
  const two = (n: number) => String(n).padStart(2, "0");
  return `${DAYS[p.weekday]} ${p.year}-${two(p.month)}-${two(p.day)}, ${two(p.hour)}:${two(p.minute)} Trinidad time`;
}

const dish = (i: MenuItem) => `- ${i.name}${i.fixedSize ? ` (${i.fixedSize})` : ""}: ${i.description}`;

function factsBlock() {
  return [
    `- Order days: ${FACTS.orderDays}. Cutoff: ${FACTS.cutoff}. Book ${FACTS.bookAhead}.`,
    `- Prices: salads ${FACTS.prices.salad}; meals ${FACTS.prices.meal}; juices ${FACTS.prices.juice}; ginger shots ${FACTS.prices.gingerShot}. ${FACTS.prices.premiumProtein}.`,
    `- Proteins: ${FACTS.proteins}.`,
    `- Delivery: ${FACTS.delivery}. Fees: ${FACTS.deliveryFees}.`,
    `- Pickup: ${FACTS.pickup.join("; ")}.`,
    `- Minimums: ${FACTS.minimums}`,
    `- How to order: ${FACTS.ordering} Salads ${SITE_URL}/salads, meals ${SITE_URL}/meals, juices ${SITE_URL}/juices.`,
    `- WhatsApp/phone ${FACTS.phone}, Instagram ${FACTS.instagramHandle}.`,
  ].join("\n");
}

function menuBlock(now: Date) {
  const monday = currentMenuWeekMonday(now);
  const current = menuForDate(monday);
  const other = current === "A" ? "B" : "A";
  const next = nextSaladDays(1, now)[0];
  return [
    `Next order day still open: ${next ? next.label : "see the website"}.`,
    ``,
    `Meals this week, ${menuWeekLabel(monday)} (Menu ${current}):`,
    ...mealsForDate(monday).map(dish),
    ``,
    `Meals the week after (Menu ${other}; the two menus keep alternating, switching Fridays at 8 AM; customers pick a date on the website to see that week's meals):`,
    ...(other === "A" ? MENU_A_MEALS : MENU_B_MEALS).map(dish),
    ``,
    `Salads (every order day):`,
    ...SALADS.map(dish),
    ``,
    `Juices and shots (every order day):`,
    ...JUICES.map(dish),
  ].join("\n");
}

/** The customer's latest words, used to choose which brain topics to load. */
export function topicQuery(turns: ChatTurn[]) {
  return turns
    .filter((t) => t.role === "user")
    .slice(-2)
    .map((t) => t.content)
    .join(" ");
}

export function buildChatSystemPrompt(brain: BrainFile[], query: string, now = new Date()) {
  const files = selectBrainFiles(brain, query);
  const core = files.filter((f) => f.always);
  const topics = files.filter((f) => !f.always);
  return [
    ...core.map((f) => f.body),
    `RIGHT NOW: ${nowLine(now)}.`,
    `# Key facts\n${factsBlock()}`,
    `# Menu\n${menuBlock(now)}`,
    ...topics.map((f) => `# ${f.title}\n${f.body.replace(/^#/gm, "##")}`),
  ].join("\n\n");
}

/** Trim and bound the conversation the browser sends before it reaches the model. */
export function sanitizeTurns(input: unknown): ChatTurn[] {
  if (!Array.isArray(input)) throw new Error("Invalid conversation");
  const turns = input
    .filter(
      (t): t is ChatTurn =>
        !!t &&
        typeof t === "object" &&
        ((t as ChatTurn).role === "user" || (t as ChatTurn).role === "assistant") &&
        typeof (t as ChatTurn).content === "string",
    )
    .map((t) => ({
      role: t.role,
      content: t.content.replaceAll(HANDOFF_TOKEN, "").trim().slice(0, CHAT_LIMITS.maxCharsPerMessage),
    }))
    .filter((t) => t.content.length > 0)
    .slice(-CHAT_LIMITS.maxTurns);
  if (turns.length === 0 || turns[turns.length - 1].role !== "user") throw new Error("Ask a question first.");
  return turns;
}

/** Split the model's reply into display text and a handoff flag. */
export function parseReply(raw: string): { text: string; handoff: boolean } {
  const handoff = raw.includes(HANDOFF_TOKEN);
  const text = raw.replaceAll(HANDOFF_TOKEN, "").trim();
  return { text, handoff };
}
