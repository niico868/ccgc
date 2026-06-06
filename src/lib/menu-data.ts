import juices from "@/assets/section-juices.jpg";
import chefsChoiceAsset from "@/assets/chefs-choice-salad.png.asset.json";
import broccoliPowerAsset from "@/assets/broccoli-power-bowl.jpeg.asset.json";
import choppedSaladAsset from "@/assets/chopped-salad.png.asset.json";
import proteinPackedAsset from "@/assets/protein-packed-bowl.jpeg.asset.json";
import quinoaChowMeinAsset from "@/assets/chinese-style-quinoa-chow-mein-bowl.png.asset.json";
import sweetPotatoBasilAsset from "@/assets/sweet-potato-basil-mash-with-chimichurri-chicken.png.asset.json";
import cuminBasmatiAsset from "@/assets/cumin-basmati-rice-with-tandoori-chicken.png.asset.json";

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

export const FOOD_MIN = 5;
export const DRINK_MIN = 6;
export const SEAFOOD_SURCHARGE = 5;

const SALAD_BASE = 40;
const MEAL_BASE = 45;

export const SALAD_FEATURE_IMAGE = chefsChoiceAsset.url;
export const MEAL_FEATURE_IMAGE = sweetPotatoBasilAsset.url;

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
    image: choppedSaladAsset.url,
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
    image: sweetPotatoBasilAsset.url,
    description:
      "A hearty roasted vegetable medley served with our in-house Thai butter chicken — rich, savoury and balanced with warm Thai-inspired flavour.",
    benefits: "Rich. Nourishing.",
    proteinOptions: MEAL_PROTEINS,
  },
];

export const JUICES: MenuItem[] = [
  {
    id: "juice-beetroot",
    category: "juice",
    name: "Beetroot",
    price: 20,
    image: juices,
    description: "Pure pressed beetroot for that deep, earthy lift after a long morning.",
    benefits: "Earthy. Restorative.",
    sizes: [
      { label: "300 ml", price: 20 },
      { label: "500 ml", price: 30 },
    ],
  },
  {
    id: "juice-mixed-vegetables",
    category: "juice",
    name: "Mixed Vegetables",
    price: 15,
    image: juices,
    description: "A bright blend of fresh vegetables and seasonal fruit, balanced and easy on the palate.",
    benefits: "Balanced. Fresh.",
    sizes: [
      { label: "300 ml", price: 15 },
      { label: "500 ml", price: 22 },
    ],
  },
  {
    id: "juice-green-juice",
    category: "juice",
    name: "Green Juice",
    price: 18,
    image: juices,
    description: "Celery, cucumber, spinach, kale and Granny Smith apple — clean, green, properly pressed.",
    benefits: "Green. Clean.",
    sizes: [
      { label: "300 ml", price: 18 },
      { label: "500 ml", price: 30 },
    ],
  },
  {
    id: "juice-ginger-shot",
    category: "juice",
    name: "Ginger Shot",
    price: 8,
    image: juices,
    description: "A small, potent ginger shot to warm and reset the system.",
    benefits: "Warm. Restoring.",
    fixedSize: "2 oz",
  },
];

export const ALL_ITEMS = [...SALADS, ...MEALS, ...JUICES];
export const findItem = (id: string) => ALL_ITEMS.find((i) => i.id === id);
