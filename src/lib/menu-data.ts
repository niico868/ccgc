import salads from "@/assets/section-salads.jpg";
import meals from "@/assets/section-meals.jpg";
import juices from "@/assets/section-juices.jpg";

export type Size = { label: string; price: number };

export type MenuItem = {
  id: string;
  name: string;
  category: "salad" | "meal" | "juice";
  price: number; // base price (or default size price)
  image: string;
  ingredients?: string;
  description: string;
  benefits?: string;
  proteinOptions?: string[];
  seafood?: boolean;
  sizes?: Size[];
  fixedSize?: string; // e.g. "2 oz" for ginger shot
};

export const SALAD_PROTEINS = ["Chicken", "Fish (+$5)", "Shrimp (+$5)", "Vegan"];
export const MEAL_PROTEINS = ["Chicken", "Fish (+$5)", "Shrimp (+$5)", "Vegan"];
export const SEAFOOD_LABELS = ["Fish (+$5)", "Shrimp (+$5)"];

export const FOOD_MIN = 5;
export const DRINK_MIN = 6;
export const SEAFOOD_SURCHARGE = 5;

const SALAD_BASE = 45;

export const SALADS: MenuItem[] = [
  {
    id: "salad-ccgc-specialty",
    category: "salad",
    name: "CCGC Specialty Salad — Chef's Choice",
    price: SALAD_BASE,
    image: salads,
    description: "A salad made from the chef's choice of fresh ingredients.",
    benefits: "Chef's pick. Always fresh.",
    proteinOptions: SALAD_PROTEINS,
  },
  {
    id: "salad-broccoli-power",
    category: "salad",
    name: "Broccoli Power Bowl",
    price: SALAD_BASE,
    image: salads,
    description: "Romaine, broccoli, fruit, seeds, sweet corn, diced chicken breast.",
    benefits: "Hearty. Crunchy. Energizing.",
    proteinOptions: SALAD_PROTEINS,
  },
  {
    id: "salad-chopped",
    category: "salad",
    name: "Chopped Salad",
    price: SALAD_BASE,
    image: salads,
    description: "Crisp chopped greens, feta, olives, radishes, sweet corn, layered chicken.",
    benefits: "Crisp. Briny. Fresh.",
    proteinOptions: SALAD_PROTEINS,
  },
  {
    id: "salad-protein-packed",
    category: "salad",
    name: "Protein Packed Bowl",
    price: SALAD_BASE,
    image: salads,
    description: "Quinoa, egg, feta, fresh vegetables, nuts, grains.",
    benefits: "Filling. Balanced. Clean.",
    proteinOptions: [...SALAD_PROTEINS, "Egg"],
  },
  {
    id: "salad-grilled-bowl",
    category: "salad",
    name: "Grilled Salad Bowl",
    price: SALAD_BASE,
    image: salads,
    description: "Roasted vegetables, chickpeas, pickled onions, cucumber, parsley, greens.",
    benefits: "Warm. Roasted. Wholesome.",
    proteinOptions: SALAD_PROTEINS,
  },
];

const MEAL_BASE = 65;

export const MEALS: MenuItem[] = [
  {
    id: "meal-green-quinoa",
    category: "meal",
    name: "Green Power Quinoa Bowl",
    price: MEAL_BASE,
    image: meals,
    description: "Quinoa, roasted broccoli and cauliflower, garlic black beans, seeds, avocado in season.",
    benefits: "Plant-powered. Filling.",
    proteinOptions: MEAL_PROTEINS,
  },
  {
    id: "meal-sweet-potato-lentil",
    category: "meal",
    name: "Sweet Potato & Lentil Plate",
    price: MEAL_BASE,
    image: meals,
    description: "Roasted sweet potato, seasoned lentils, string beans, nuts, chia.",
    benefits: "Hearty. Nourishing.",
    proteinOptions: MEAL_PROTEINS,
  },
  {
    id: "meal-couscous-garden",
    category: "meal",
    name: "Grilled Garden Couscous Bowl",
    price: MEAL_BASE,
    image: meals,
    description: "Couscous, grilled vegetables, sprouts, pumpkin seeds, almonds.",
    benefits: "Fresh. Light. Flavorful.",
    proteinOptions: MEAL_PROTEINS,
  },
  {
    id: "meal-power-rice",
    category: "meal",
    name: "Power Rice Bowl",
    price: MEAL_BASE,
    image: meals,
    description: "Brown rice or quinoa, steamed broccoli, roasted cauliflower, beans, seeds, lemon olive oil.",
    benefits: "Balanced. Energizing.",
    proteinOptions: MEAL_PROTEINS,
  },
  {
    id: "meal-sweet-potato-power",
    category: "meal",
    name: "Sweet Potato Power Bowl",
    price: MEAL_BASE,
    image: meals,
    description: "Brown rice or lentils, garlic butter sweet potato, beetroot, string beans, nuts, seeds.",
    benefits: "Warm. Restorative.",
    proteinOptions: MEAL_PROTEINS,
  },
  {
    id: "meal-couscous-wellness",
    category: "meal",
    name: "Couscous Wellness Bowl",
    price: MEAL_BASE,
    image: meals,
    description: "Couscous, Parmesan zucchini, sweet potato, cucumber, carrots, cranberries, walnuts.",
    benefits: "Fresh. Satisfying.",
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
    description: "Rich beetroot juice for earthy flavor and natural energy.",
    benefits: "Rich. Restorative.",
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
    description: "A bright mixed blend of fresh vegetables and fruit.",
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
    description: "Celery, cucumber, spinach, kale, Granny Smith apple.",
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
    description: "A small, potent ginger wellness shot.",
    benefits: "Warm. Restoring.",
    fixedSize: "2 oz",
  },
];

export const ALL_ITEMS = [...SALADS, ...MEALS, ...JUICES];
export const findItem = (id: string) => ALL_ITEMS.find((i) => i.id === id);
