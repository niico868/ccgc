import salads from "@/assets/section-salads.jpg";
import meals from "@/assets/section-meals.jpg";
import juices from "@/assets/section-juices.jpg";

export type MenuItem = {
  id: string;
  name: string;
  category: "salad" | "meal" | "juice";
  price: number;
  image: string;
  ingredients: string;
  description: string;
  proteinOptions?: string[];
  addons?: { name: string; price: number }[];
  juiceOptions?: string[];
  seafood?: boolean;
};

const PROTEIN = ["Regular", "Large (+$10)"];
const ADDONS = [
  { name: "Avocado", price: 10 },
  { name: "Feta", price: 8 },
  { name: "Extra Protein", price: 15 },
  { name: "Boiled Egg", price: 6 },
];

export const SALADS: MenuItem[] = [
  { id: "salad-1", category: "salad", name: "Grilled Chicken Garden Salad", price: 75, image: salads,
    ingredients: "Mixed greens, grilled chicken, cherry tomatoes, cucumber, red onion, house vinaigrette.",
    description: "Our signature garden salad, built fresh and packed with flavor.",
    proteinOptions: PROTEIN, addons: ADDONS },
  { id: "salad-2", category: "salad", name: "Seafood Harvest Salad", price: 95, seafood: true, image: salads,
    ingredients: "Mixed greens, shrimp, smoked fish, avocado, sweet peppers, citrus dressing.",
    description: "Ocean-fresh seafood over crisp greens with a bright citrus finish.",
    proteinOptions: PROTEIN, addons: ADDONS },
  { id: "salad-3", category: "salad", name: "Quinoa Power Salad", price: 75, image: salads,
    ingredients: "Quinoa, kale, chickpeas, roasted sweet potato, pumpkin seeds, lemon-tahini.",
    description: "Plant-powered, protein-rich, and deeply satisfying.",
    proteinOptions: PROTEIN, addons: ADDONS },
  { id: "salad-4", category: "salad", name: "Berry Cashew Green Salad", price: 70, image: salads,
    ingredients: "Spring mix, strawberries, blueberries, cashews, goat cheese, balsamic glaze.",
    description: "Sweet, tangy, crunchy — a refreshing salad with character.",
    proteinOptions: PROTEIN, addons: ADDONS },
  { id: "salad-5", category: "salad", name: "Classic Clean Green Salad", price: 65, image: salads,
    ingredients: "Romaine, baby spinach, cucumber, carrot ribbons, sunflower seeds, herb dressing.",
    description: "Simple, clean, and crisp — exactly what good greens should taste like.",
    proteinOptions: PROTEIN, addons: ADDONS },
];

export const MEALS: MenuItem[] = [
  { id: "meal-1", category: "meal", name: "Grilled Chicken Wellness Bowl", price: 80, image: meals,
    ingredients: "Grilled chicken, brown rice, roasted broccoli, sweet potato, herb oil.",
    description: "Balanced, wholesome, and built to fuel your day.",
    proteinOptions: PROTEIN, addons: ADDONS },
  { id: "meal-2", category: "meal", name: "Baked Fish Clean Plate", price: 95, seafood: true, image: meals,
    ingredients: "Oven-baked white fish, quinoa, sautéed greens, lemon-herb sauce.",
    description: "Light, flaky, and full of clean Caribbean flavor.",
    proteinOptions: PROTEIN, addons: ADDONS },
  { id: "meal-3", category: "meal", name: "Shrimp Quinoa Meal", price: 95, seafood: true, image: meals,
    ingredients: "Garlic shrimp, quinoa, roasted peppers, kale, citrus drizzle.",
    description: "A protein-rich plate with bright, sun-kissed flavor.",
    proteinOptions: PROTEIN, addons: ADDONS },
  { id: "meal-4", category: "meal", name: "Herb Chicken Vegetable Plate", price: 80, image: meals,
    ingredients: "Herb-roasted chicken, seasonal vegetables, ground provisions, gravy.",
    description: "A true Caribbean Sunday plate — made clean.",
    proteinOptions: PROTEIN, addons: ADDONS },
  { id: "meal-5", category: "meal", name: "Classic Healthy Lunch Plate", price: 75, image: meals,
    ingredients: "Choice of protein, brown rice, steamed vegetables, side salad.",
    description: "Our everyday favorite — affordable, filling, and clean.",
    proteinOptions: PROTEIN, addons: ADDONS },
];

export const JUICES: MenuItem[] = [
  { id: "juice-1", category: "juice", name: "Pineapple Cucumber Refresher", price: 35, image: juices,
    ingredients: "Pineapple, cucumber, mint, lime.",
    description: "Light, hydrating, and gently sweet.",
    juiceOptions: ["12oz", "16oz (+$10)"] },
  { id: "juice-2", category: "juice", name: "Beetroot Energy Blend", price: 40, image: juices,
    ingredients: "Beetroot, carrot, apple, ginger, lemon.",
    description: "Earthy, vibrant, and naturally energizing.",
    juiceOptions: ["12oz", "16oz (+$10)"] },
  { id: "juice-3", category: "juice", name: "Watermelon Clean Hydrator", price: 35, image: juices,
    ingredients: "Watermelon, lime, mint.",
    description: "Pure hydration in a bottle.",
    juiceOptions: ["12oz", "16oz (+$10)"] },
];

export const ALL_ITEMS = [...SALADS, ...MEALS, ...JUICES];
export const findItem = (id: string) => ALL_ITEMS.find((i) => i.id === id);
