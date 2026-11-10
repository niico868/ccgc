import chefsChoiceAsset from "@/assets/chefs-choice-salad.png.asset.json";
import broccoliPowerAsset from "@/assets/broccoli-power-bowl.jpeg.asset.json";
import choppedSaladAsset from "@/assets/chopped-salad.png.asset.json";
import proteinPackedAsset from "@/assets/protein-packed-bowl.jpeg.asset.json";
import grilledSaladAsset from "@/assets/grilled-salad-bowl.png.asset.json";
import quinoaChowMeinAsset from "@/assets/chinese-style-quinoa-chow-mein-bowl.png.asset.json";
import sweetPotatoBasilAsset from "@/assets/sweet-potato-basil-mash-with-chimichurri-chicken.png.asset.json";
import cuminBasmatiAsset from "@/assets/cumin-basmati-rice-with-tandoori-chicken.png.asset.json";
import roastedVegetableMealAsset from "@/assets/roasted-vegetable-medley-with-thai-butter-chicken.png.asset.json";
import beetRootAsset from "@/assets/beet-root-cold-press.png.asset.json";
import watermelonAsset from "@/assets/watermelon-cold-press.png.asset.json";
import gingerShotAsset from "@/assets/ginger-shot-cold-press.png.asset.json";

import zestyAsset from "@/assets/zesty-herb-bowl.png.asset.json";
import moroccanAsset from "@/assets/moroccan-chicken-couscous.png.asset.json";
import mexAsset from "@/assets/mediterranean-mex-bowl.png.asset.json";
import mexSideAsset from "@/assets/mediterranean-mex-side.jpg.asset.json";

export type Size = { label: string; price: number };

export type MenuItem = {
  id: string;
  name: string;
  category: "salad" | "meal" | "juice";
  price: number;
  image: string;
  images?: string[];
  note?: string;
  ingredients?: string;
  description: string;
  benefits?: string;
  proteinOptions?: string[];
  seafood?: boolean;
  sizes?: Size[];
  fixedSize?: string;
  /** Short labels shown as chips on cards and dish pages (diet, prep style). */
  tags?: string[];
};

/** Customer-facing price formatter. */
export const fmt = (n: number) => `$${n.toFixed(0)}`;
/** @deprecated retained for backwards compatibility — use fmt() with a price. */
export const PRICELESS = "[PRICELESS]";

export const SALAD_PROTEINS = ["Chicken", "Beef", "Fish", "Shrimp", "Vegetarian"];
export const MEAL_PROTEINS = ["Chicken", "Beef", "Fish", "Shrimp", "Vegetarian"];
/** Proteins that carry the $5 premium addition per item. */
export const PREMIUM_PROTEINS = ["Fish", "Shrimp", "Beef"];
/** @deprecated use PREMIUM_PROTEINS */
export const SEAFOOD_LABELS = PREMIUM_PROTEINS;
/** Customer facing summary of the protein choices offered on salads and meals. */
export const PROTEIN_COPY = "Choose chicken, beef, fish, shrimp or vegetarian. Beef, fish and shrimp add $5 per item.";


export const FOOD_MIN = 5;
export const DRINK_MIN = 6;
export const SEAFOOD_SURCHARGE = 5;
/** Premium protein addition per item (beef, fish, shrimp). */
export const PREMIUM_SURCHARGE = 5;

/** Batch sizes — items are only sold in these multiples. */
export const SALAD_BATCH = 5;
export const MEAL_BATCH = 5;
export const JUICE_BATCH = 6;
export const GINGER_BATCH = 6;


const SALAD_BASE = 45;
const MEAL_BASE = 50;

/** Ingredients commonly found in CCGC salads — used by the "leave out" dropdown. */
export const SALAD_INGREDIENTS = [
  "Romaine lettuce",
  "Mixed greens",
  "Spinach",
  "Broccoli florets",
  "Cucumber",
  "Sweet corn",
  "Cherry tomatoes",
  "Bell peppers",
  "Red onion",
  "Pickled onion",
  "Carrots",
  "Avocado",
  "Chickpeas",
  "Quinoa",
  "Boiled egg",
  "Feta",
  "Olives",
  "Roasted vegetables",
  "Seasonal fruit",
  "Toasted seeds",
] as const;

/** Labels on every juice and shot. */
export const JUICE_TAGS = ["Diabetic-friendly*", "No added sugar", "Cold-pressed"];
/** What the asterisk on "Diabetic-friendly*" means, shown wherever the label appears. */
export const DIABETIC_NOTE =
  "*Diabetic-friendly: no added sugar, pressed from specially sourced produce. Fruit and vegetables still contain natural sugars, so if you manage diabetes, check portions with your doctor.";
const SALAD_TAGS = ["Made fresh on the day", "Vegetarian option"];
const MEAL_TAGS = ["Homestyle", "Vegetarian option"];

export const SALAD_FEATURE_IMAGE = grilledSaladAsset.url;
export const MEAL_FEATURE_IMAGE = roastedVegetableMealAsset.url;
export const JUICE_FEATURE_IMAGE = watermelonAsset.url;

export const SALADS: MenuItem[] = [
  {
    id: "salad-ccgc-specialty",
    category: "salad",
    name: "CCGC Specialty Salad: Chef's Choice",
    price: SALAD_BASE,
    image: chefsChoiceAsset.url,
    description: "A salad built around Cathy's pick of the freshest produce on the morning's prep counter.",
    benefits: "Chef's Pick. Always Fresh.",
    proteinOptions: SALAD_PROTEINS,
  },
  {
    id: "salad-broccoli-power",
    category: "salad",
    name: "Broccoli Power Bowl",
    price: SALAD_BASE,
    image: broccoliPowerAsset.url,
    description: "Romaine, broccoli, seasonal fruit, toasted seeds, sweet corn and tender diced chicken breast.",
    benefits: "Hearty. Satisfying.",
    proteinOptions: SALAD_PROTEINS,
  },
  {
    id: "salad-chopped",
    category: "salad",
    name: "Chopped Salad",
    price: SALAD_BASE,
    image: choppedSaladAsset.url,
    description: "Crisp chopped greens with feta, olives, radish, sweet corn and properly layered chicken.",
    benefits: "Crisp. Well-Balanced.",
    proteinOptions: SALAD_PROTEINS,
  },
  {
    id: "salad-protein-packed",
    category: "salad",
    name: "Protein Packed Bowl",
    price: SALAD_BASE,
    image: proteinPackedAsset.url,
    description: "Quinoa, boiled egg, feta, garden vegetables, nuts and grains, a proper, filling plate.",
    benefits: "Filling. Clean.",
    proteinOptions: [...SALAD_PROTEINS, "Egg"],
  },
  {
    id: "salad-grilled-bowl",
    category: "salad",
    name: "Grilled Salad Bowl",
    price: SALAD_BASE,
    image: grilledSaladAsset.url,
    description: "Roasted vegetables, chickpeas, pickled onion, cucumber and parsley over fresh greens.",
    benefits: "Warm. Wholesome.",
    proteinOptions: SALAD_PROTEINS,
  },
];

export const MENU_A_MEALS: MenuItem[] = [
  {
    id: "meal-quinoa-chow-mein",
    category: "meal",
    name: "Chinese-Style Quinoa Chow Mein Bowl",
    price: MEAL_BASE,
    image: quinoaChowMeinAsset.url,
    description:
      "Fluffy quinoa sautéed chow mein–style with chunky vegetables, served with oven-baked Chinese-style chicken for a clean, full-flavoured, protein-rich plate.",
    benefits: "Proper. Full-Flavoured.",
    proteinOptions: MEAL_PROTEINS,
  },
  {
    id: "meal-sweet-potato-basil",
    category: "meal",
    name: "Sweet Potato Basil Mash with Chimichurri Chicken",
    price: MEAL_BASE,
    image: sweetPotatoBasilAsset.url,
    description:
      "Creamy sweet potato and basil mash served with sautéed garlic-parsley vegetables, grilled chicken, fresh chimichurri, and a light topping of alfalfa or broccoli sprouts.",
    benefits: "Wholesome. Homestyle.",
    proteinOptions: MEAL_PROTEINS,
  },
  {
    id: "meal-cumin-basmati-tandoori",
    category: "meal",
    name: "Cumin Basmati Rice with Tandoori Chicken",
    price: MEAL_BASE,
    image: cuminBasmatiAsset.url,
    description:
      "Cumin-infused basmati rice served with Indian-spiced oven-roasted vegetables and topped with tender tandoori-style chicken.",
    benefits: "Hearty. Well-Seasoned.",
    proteinOptions: MEAL_PROTEINS,
  },
  {
    id: "meal-roasted-veg-thai-butter",
    category: "meal",
    name: "Roasted Vegetable Medley with Thai Butter Chicken",
    price: MEAL_BASE,
    image: roastedVegetableMealAsset.url,
    description:
      "A hearty roasted vegetable medley served with our in-house Thai butter chicken: rich, savoury and balanced with warm Thai-inspired flavour.",
    benefits: "Rich. Nourishing.",
    proteinOptions: MEAL_PROTEINS,
  },
];

/**
 * Juice & shot pricing — sold in batches only:
 *   - 300 ml cold-press juices: $18 each (batch of 6 = $108)
 *   - Ginger shots: $8 each (batch of 6 = $48)
 */
export const JUICES: MenuItem[] = [
  {
    id: "juice-beetroot",
    category: "juice",
    name: "Beetroot",
    price: 18,
    image: beetRootAsset.url,
    description: "Pure cold-pressed beetroot with no added sugar, for that deep, earthy lift after a long morning. A diabetic-friendly favourite pressed from specially sourced produce.",
    benefits: "Earthy. Restorative.",
    tags: JUICE_TAGS,
    fixedSize: "300 ml",
  },
  {
    id: "juice-watermelon",
    category: "juice",
    name: "Watermelon",
    price: 18,
    image: watermelonAsset.url,
    description: "Cold-pressed watermelon with a bright, cooling finish that feels crisp and refreshing. Nothing added: no sugar, no syrups, just the fruit.",
    benefits: "Cooling. Bright.",
    tags: JUICE_TAGS,
    fixedSize: "300 ml",
  },
  {
    id: "juice-mixed-veg",
    category: "juice",
    name: "Mixed Veg",
    price: 18,
    image: beetRootAsset.url,
    description: "A diabetic-friendly blend of fruits and vegetables for that green boost: carrot, pineapple, melon and cucumber, cold-pressed with no added sugar.",
    benefits: "Green Boost. Refreshing.",
    tags: JUICE_TAGS,
    fixedSize: "300 ml",
  },
  {
    id: "juice-ginger-shot",
    category: "juice",
    name: "Ginger Shot",
    price: 8,
    image: gingerShotAsset.url,
    description: "A small, potent ginger shot to warm and reset the system. Pressed fresh with no added sugar, so it suits a diabetic-friendly routine.",
    benefits: "Warm. Restoring.",
    tags: JUICE_TAGS,
    fixedSize: "2 oz",
  },
];


export const MENU_B_MEALS: MenuItem[] = [
  { id: "meal-zesty-herb-bowl", name: "Zesty Herb Bowl", category: "meal", price: MEAL_BASE,
    image: zestyAsset.url, proteinOptions: MEAL_PROTEINS,
    description: "Herb-roasted smashed baby potatoes over our garlic butter and olive oil hummus, topped with lemon-herb grilled chicken, house-pickled jalapeños and a fresh sprout and herb garnish." },
  { id: "meal-mediterranean-mex-bowl", name: "Mediterranean Mex Bowl", category: "meal", price: MEAL_BASE,
    image: mexAsset.url, images: [mexAsset.url, mexSideAsset.url], proteinOptions: MEAL_PROTEINS,
    description: "Mexican black beans with roasted melongene, minced beef, feta and fresh basil, served with zesty grilled chicken and a crisp Mediterranean salad of spinach, tomato, cucumber and red onion.",
    note: "Choosing Vegetarian? We leave out the minced beef and chicken." },
  { id: "meal-moroccan-chicken-couscous", name: "Moroccan Spiced Chicken & Couscous Bowl", category: "meal", price: MEAL_BASE,
    image: moroccanAsset.url, proteinOptions: MEAL_PROTEINS,
    description: "Fluffy couscous sautéed with vegetables, served with our Moroccan-spiced chicken breast, pumpkin, carrots, chickpeas and bell peppers in our in-house spices." },
];
for (const item of SALADS) item.tags ??= SALAD_TAGS;
for (const item of [...MENU_A_MEALS, ...MENU_B_MEALS]) item.tags ??= MEAL_TAGS;

export const MEALS: MenuItem[] = [...MENU_A_MEALS, ...MENU_B_MEALS];

export const ALL_ITEMS = [...SALADS, ...MEALS, ...JUICES];
export const findItem = (id: string) => ALL_ITEMS.find((i) => i.id === id);

/** URL-friendly name used for each dish page, e.g. /menu/zesty-herb-bowl. */
export const dishSlug = (item: Pick<MenuItem, "name">) =>
  item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const dishPath = (item: Pick<MenuItem, "name">) => `/menu/${dishSlug(item)}`;
export const findBySlug = (slug: string) => ALL_ITEMS.find((i) => dishSlug(i) === slug);

export const CATEGORY_INFO = {
  salad: { label: "Custom Salads", single: "Salad", path: "/salads" as const },
  meal: { label: "Healthy Meals", single: "Healthy Meal", path: "/meals" as const },
  juice: { label: "Diabetic-Friendly Cold-Pressed Juices", single: "Cold-Pressed Juice", path: "/juices" as const },
};
