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

export type Size = { label: string; price: number };

export type MenuItem = {
  id: string;
  name: string;
  category: "salad" | "meal" | "juice";
  price: number;
  image: string;
  ingredients?: string;
  description: string;
  benefits?: string;
  proteinOptions?: string[];
  seafood?: boolean;
  sizes?: Size[];
  fixedSize?: string;
};

/** Customer-facing price label. All prices read [PRICELESS] on the website. */
export const PRICELESS = "[PRICELESS]";

export const SALAD_PROTEINS = ["Chicken", "Fish", "Shrimp", "Vegan"];
export const MEAL_PROTEINS = ["Chicken", "Fish", "Shrimp", "Vegan"];
export const SEAFOOD_LABELS = ["Fish", "Shrimp"];

/** Customer-facing price formatter. */
export const fmt = (n: number) => `$${n.toFixed(0)}`;
/** @deprecated retained for backwards compatibility — use fmt() with a price. */
export const PRICELESS = "[PRICELESS]";

export const SALAD_PROTEINS = ["Chicken", "Fish", "Shrimp", "Vegan"];
export const MEAL_PROTEINS = ["Chicken", "Fish", "Shrimp", "Vegan"];
export const SEAFOOD_LABELS = ["Fish", "Shrimp"];

export const FOOD_MIN = 5;
export const DRINK_MIN = 6;
export const SEAFOOD_SURCHARGE = 5;

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

export const SALAD_FEATURE_IMAGE = grilledSaladAsset.url;
export const MEAL_FEATURE_IMAGE = roastedVegetableMealAsset.url;
export const JUICE_FEATURE_IMAGE = watermelonAsset.url;

export const SALADS: MenuItem[] = [
  {
    id: "salad-ccgc-specialty",
    category: "salad",
    name: "CCGC Specialty Salad — Chef's Choice",
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
    description: "Quinoa, boiled egg, feta, garden vegetables, nuts and grains — a proper, filling plate.",
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

export const MEALS: MenuItem[] = [
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
      "A hearty roasted vegetable medley served with our in-house Thai butter chicken — rich, savoury and balanced with warm Thai-inspired flavour.",
    benefits: "Rich. Nourishing.",
    proteinOptions: MEAL_PROTEINS,
  },
];

/**
 * Juice prices reflect per-bottle equivalents from bulk packs:
 *   - 300 ml cold-press: $100 / 6 ≈ $17 each (only sold in 6s)
 *   - Ginger shots: $50 / 6 ≈ $9 each (only sold in 6s)
 */
export const JUICES: MenuItem[] = [
  {
    id: "juice-beetroot",
    category: "juice",
    name: "Beetroot",
    price: 17,
    image: beetRootAsset.url,
    description: "Pure pressed beetroot for that deep, earthy lift after a long morning.",
    benefits: "Earthy. Restorative.",
    sizes: [
      { label: "300 ml", price: 17 },
      { label: "500 ml", price: 28 },
    ],
  },
  {
    id: "juice-watermelon",
    category: "juice",
    name: "Watermelon",
    price: 17,
    image: watermelonAsset.url,
    description: "Cold-pressed watermelon with a bright, cooling finish that feels crisp and refreshing.",
    benefits: "Cooling. Bright.",
    sizes: [
      { label: "300 ml", price: 17 },
      { label: "500 ml", price: 28 },
    ],
  },
  {
    id: "juice-mixed-veg",
    category: "juice",
    name: "Mixed Veg",
    price: 17,
    image: beetRootAsset.url,
    description: "Mixture of fruits and vegetables for that green boost — carrot, pineapple, melon and cucumber.",
    benefits: "Green Boost. Refreshing.",
    sizes: [
      { label: "300 ml", price: 17 },
      { label: "500 ml", price: 28 },
    ],
  },
  {
    id: "juice-ginger-shot",
    category: "juice",
    name: "Ginger Shot",
    price: 9,
    image: gingerShotAsset.url,
    description: "A small, potent ginger shot to warm and reset the system. Sold in packs of 6.",
    benefits: "Warm. Restoring.",
    fixedSize: "2 oz",
  },
];

export const ALL_ITEMS = [...SALADS, ...MEALS, ...JUICES];
export const findItem = (id: string) => ALL_ITEMS.find((i) => i.id === id);
