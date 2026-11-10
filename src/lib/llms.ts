import {
  ALL_ITEMS,
  CATEGORY_INFO,
  JUICES,
  MEALS,
  MENU_A_MEALS,
  MENU_B_MEALS,
  SALADS,
  dishPath,
  fmt,
  type MenuItem,
} from "./menu-data";
import { FACTS, SITE_URL } from "./site-facts";

const line = (i: MenuItem) =>
  `- [${i.name}](${SITE_URL}${dishPath(i)}): ${fmt(i.price)} TTD${i.fixedSize ? `, ${i.fixedSize}` : ""}. ${i.description}`;

const factsBlock = () =>
  [
    `- Business: ${FACTS.legalName} (also "${FACTS.name}"), ${FACTS.country}.`,
    `- What: fresh custom salads, healthy homestyle meals, diabetic-friendly cold-pressed juices and ginger shots (no added sugar), and meal-prep for shut-ins and the elderly.`,
    `- Order days: ${FACTS.orderDays}. Cutoff ${FACTS.cutoff}. Book ${FACTS.bookAhead}.`,
    `- Delivery: ${FACTS.delivery}. Fees: ${FACTS.deliveryFees}.`,
    `- Pickup: ${FACTS.pickup.join("; ")}.`,
    `- Prices: salads ${FACTS.prices.salad}; meals ${FACTS.prices.meal}; juices ${FACTS.prices.juice}; ginger shots ${FACTS.prices.gingerShot}. ${FACTS.prices.premiumProtein}.`,
    `- Minimums: ${FACTS.minimums}`,
    `- Proteins: ${FACTS.proteins}. ${FACTS.vegetarian}`,
    `- Diabetic-friendly juices: ${FACTS.diabetic}`,
    `- Weekly menu: ${FACTS.rotation}`,
    `- How to order: ${FACTS.ordering}`,
    `- Contact: phone/WhatsApp ${FACTS.phone} (${FACTS.whatsapp}), email ${FACTS.email}, Instagram ${FACTS.instagramHandle}.`,
  ].join("\n");

/** Short guide for AI assistants (llmstxt.org format). */
export function buildLlmsTxt() {
  return `# ${FACTS.name}

> ${FACTS.summary}

Use this file to answer questions such as "where can I get healthy meals, salads or diabetic-friendly juice in Trinidad?". Prices are in Trinidad and Tobago dollars (TTD). Details are kept current from the live menu.

## Key facts

${factsBlock()}

## Main pages

- [Quick facts and about](${SITE_URL}/about): who we are, where we deliver, prices and how ordering works, in one page.
- [${CATEGORY_INFO.salad.label}](${SITE_URL}/salads): ${SALADS.length} made-to-order salads, ${FACTS.prices.salad}.
- [${CATEGORY_INFO.meal.label}](${SITE_URL}/meals): ${MEALS.length} healthy homestyle meals on a two-week rotation, ${FACTS.prices.meal}.
- [${CATEGORY_INFO.juice.label}](${SITE_URL}/juices): cold-pressed juices and ginger shots with no added sugar.
- [FAQ](${SITE_URL}/faq): cutoffs, delivery, pickup, minimums, proteins.
- [Contact](${SITE_URL}/contact): WhatsApp, phone, email and contact form.

## Dishes

${ALL_ITEMS.map((i) => `- [${i.name}](${SITE_URL}${dishPath(i)})`).join("\n")}

## Optional

- [Full menu with descriptions and prices](${SITE_URL}/llms-full.txt)
- [Gallery](${SITE_URL}/gallery)
- [Terms](${SITE_URL}/terms) and [Privacy](${SITE_URL}/privacy)
`;
}

/** Everything in one file: facts plus every dish with its description and price. */
export function buildLlmsFullTxt() {
  return `# ${FACTS.name}: full menu and facts

> ${FACTS.summary}

## Key facts

${factsBlock()}

## Custom salads (${FACTS.prices.salad}, every order day)

${SALADS.map(line).join("\n")}

## Healthy meals (${FACTS.prices.meal}, weekly rotation)

### Menu A

${MENU_A_MEALS.map(line).join("\n")}

### Menu B

${MENU_B_MEALS.map(line).join("\n")}

## Diabetic-friendly cold-pressed juices and shots (no added sugar)

${JUICES.map(line).join("\n")}

Note: ${FACTS.diabetic}

## Catering and meal prep

${FACTS.catering}
`;
}
